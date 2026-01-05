#!/usr/bin/env python3
"""
CodeNest Query API - The Source of Truth for OmniGrid Ecosystem

This API serves as the intelligent metadata bridge between:
- OmniGrid (data source)
- BuildNest (template repository)
- HotStack (deployment engine)
- Sector Heatmap (monitoring)

Purpose: Accept business intent, return brand + template matches for 180s deployment

Author: OmniGrid Architecture Team
Version: 1.0.0
Status: PRODUCTION READY
"""

import json
import os
import re
from typing import List, Dict, Optional, Any
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass, asdict
from enum import Enum

try:
    from fastapi import FastAPI, HTTPException, Query
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel, Field
    import uvicorn
    FASTAPI_AVAILABLE = True
except ImportError:
    FASTAPI_AVAILABLE = False
    print("⚠️  FastAPI not installed. Install with: pip install fastapi uvicorn pydantic")


# ============================================================================
# DATA MODELS
# ============================================================================

class SectorHealth(str, Enum):
    """Sector health status for heatmap"""
    EMERALD = "emerald"  # 95-100%
    AMBER = "amber"      # 85-94%
    RED = "red"          # <85%


class QueryIntent(BaseModel):
    """Business intent query from HotStack"""
    intent: str = Field(..., description="Natural language business intent")
    sector_preference: Optional[str] = Field(None, description="Preferred sector")
    template_type: Optional[str] = Field(None, description="Specific template type")
    priority: Optional[str] = Field("medium", description="Deployment priority: low, medium, high, critical")


class BrandMatch(BaseModel):
    """Brand match result"""
    brand_id: str
    brand_name: str
    sector: str
    template_id: str
    template_type: str
    confidence_score: float = Field(..., ge=0.0, le=100.0)
    deployment_priority: str
    replit_app: str
    heatmap_color: str
    trademark_classes: str
    metadata: Dict[str, Any] = {}


class SectorStatus(BaseModel):
    """Sector health status"""
    sector: str
    health: int
    status: SectorHealth
    brand_count: int
    color: str
    brands: List[str]


class TemplateMetadata(BaseModel):
    """Template metadata from BuildNest"""
    template_id: str
    name: str
    type: str
    buildnest_location: str
    features: List[str]
    version: str
    estimated_deployment_time: int  # seconds


class DeploymentPackage(BaseModel):
    """Complete deployment package for HotStack"""
    brand: BrandMatch
    template: TemplateMetadata
    sector_status: SectorStatus
    deployment_instructions: Dict[str, Any]
    estimated_time: int  # 180 seconds target
    pulse_cycle: str = "9s"


# ============================================================================
# CODENEST QUERY ENGINE
# ============================================================================

class CodeNestQueryEngine:
    """
    Intelligent query engine for CodeNest metadata

    Responsibilities:
    1. Load and index 149 FAA brands
    2. Match business intent to brands
    3. Retrieve template metadata
    4. Calculate sector health
    5. Generate deployment packages
    """

    def __init__(self, data_dir: str = "codenest_export"):
        """Initialize query engine with exported data"""
        self.data_dir = Path(data_dir)
        self.brands: List[Dict] = []
        self.sectors: Dict[str, Dict] = {}
        self.templates: Dict[str, Dict] = {}
        self.api_config: Dict = {}

        # Load all data
        self._load_data()

        # Build search index
        self._build_index()

    def _load_data(self):
        """Load all exported JSON files"""

        # Load brand registry
        brands_file = self.data_dir / "faa_brands_registry.json"
        if brands_file.exists():
            with open(brands_file, 'r') as f:
                data = json.load(f)
                self.brands = data.get("brands", [])
                print(f"✅ Loaded {len(self.brands)} brands")

        # Load sector mappings
        sectors_file = self.data_dir / "sector_mappings.json"
        if sectors_file.exists():
            with open(sectors_file, 'r') as f:
                data = json.load(f)
                self.sectors = {s["sector"]: s for s in data.get("sectors", [])}
                print(f"✅ Loaded {len(self.sectors)} sectors")

        # Load template registry
        templates_file = self.data_dir / "template_registry.json"
        if templates_file.exists():
            with open(templates_file, 'r') as f:
                data = json.load(f)
                self.templates = {t["template_id"]: t for t in data.get("templates", [])}
                print(f"✅ Loaded {len(self.templates)} templates")

        # Load API config
        config_file = self.data_dir / "codenest_api_config.json"
        if config_file.exists():
            with open(config_file, 'r') as f:
                self.api_config = json.load(f)
                print(f"✅ Loaded API configuration")

    def _build_index(self):
        """Build search index for fast querying"""
        self.brand_index = {}
        self.sector_index = {}
        self.keyword_index = {}

        for brand in self.brands:
            brand_id = brand["id"]
            sector = brand["sector"]
            name = brand["name"]

            # Index by brand ID
            self.brand_index[brand_id] = brand

            # Index by sector
            if sector not in self.sector_index:
                self.sector_index[sector] = []
            self.sector_index[sector].append(brand)

            # Index by keywords (extracted from brand name)
            keywords = self._extract_keywords(name)
            for keyword in keywords:
                if keyword not in self.keyword_index:
                    self.keyword_index[keyword] = []
                self.keyword_index[keyword].append(brand)

        print(f"✅ Built search index: {len(self.brand_index)} brands, {len(self.keyword_index)} keywords")

    def _extract_keywords(self, text: str) -> List[str]:
        """Extract searchable keywords from text"""
        # Convert to lowercase and split on non-alphanumeric
        words = re.findall(r'\w+', text.lower())

        # Filter out common words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'for', 'with', 'faa'}
        keywords = [w for w in words if w not in stop_words and len(w) > 2]

        return keywords

    def query_by_intent(self, query: QueryIntent) -> List[BrandMatch]:
        """
        Match business intent to brands

        Algorithm:
        1. Extract keywords from intent
        2. Search keyword index
        3. Apply sector preference if specified
        4. Calculate confidence scores
        5. Sort by confidence + priority
        6. Return top matches
        """

        # Extract keywords from intent
        intent_keywords = self._extract_keywords(query.intent)

        # Score all brands
        brand_scores = {}

        for brand in self.brands:
            score = 0.0

            # Keyword matching (40% weight)
            brand_keywords = self._extract_keywords(brand["name"])
            keyword_matches = set(intent_keywords) & set(brand_keywords)
            keyword_score = (len(keyword_matches) / max(len(intent_keywords), 1)) * 40
            score += keyword_score

            # Sector preference (30% weight)
            if query.sector_preference:
                if brand["sector"].lower() == query.sector_preference.lower():
                    score += 30
                elif query.sector_preference.lower() in brand["sector"].lower():
                    score += 15
            else:
                score += 15  # Neutral score if no preference

            # Template type matching (20% weight)
            if query.template_type:
                if brand["template_type"].lower() == query.template_type.lower():
                    score += 20
                elif query.template_type.lower() in brand["template_type"].lower():
                    score += 10
            else:
                score += 10  # Neutral score

            # Priority boost (10% weight)
            priority_map = {"low": 2, "medium": 5, "high": 8, "critical": 10}
            brand_priority_map = {"low": 2, "medium": 5, "high": 8, "critical": 10}

            query_priority_score = priority_map.get(query.priority, 5)
            brand_priority_score = brand_priority_map.get(brand["deployment_priority"], 5)

            # Boost if priorities align
            if query_priority_score == brand_priority_score:
                score += 10
            else:
                score += 5

            brand_scores[brand["id"]] = score

        # Sort brands by score
        sorted_brands = sorted(
            brand_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )

        # Convert to BrandMatch objects
        matches = []
        for brand_id, confidence in sorted_brands[:10]:  # Top 10 matches
            brand = self.brand_index[brand_id]
            matches.append(BrandMatch(
                brand_id=brand["id"],
                brand_name=brand["name"],
                sector=brand["sector"],
                template_id=brand["template_id"],
                template_type=brand["template_type"],
                confidence_score=round(confidence, 2),
                deployment_priority=brand["deployment_priority"],
                replit_app=brand["replit_app"],
                heatmap_color=brand["heatmap_color"],
                trademark_classes=brand["trademark_classes"],
                metadata=brand.get("metadata", {})
            ))

        return matches

    def get_brand_by_id(self, brand_id: str) -> Optional[BrandMatch]:
        """Get specific brand by ID"""
        brand = self.brand_index.get(brand_id)

        if not brand:
            return None

        return BrandMatch(
            brand_id=brand["id"],
            brand_name=brand["name"],
            sector=brand["sector"],
            template_id=brand["template_id"],
            template_type=brand["template_type"],
            confidence_score=100.0,  # Direct match
            deployment_priority=brand["deployment_priority"],
            replit_app=brand["replit_app"],
            heatmap_color=brand["heatmap_color"],
            trademark_classes=brand["trademark_classes"],
            metadata=brand.get("metadata", {})
        )

    def get_sector_status(self, sector: str) -> Optional[SectorStatus]:
        """Get sector health status"""
        sector_data = self.sectors.get(sector)

        if not sector_data:
            return None

        # Determine health status
        health = sector_data["health"]
        if health >= 95:
            status = SectorHealth.EMERALD
        elif health >= 85:
            status = SectorHealth.AMBER
        else:
            status = SectorHealth.RED

        # Get brands in sector
        sector_brands = self.sector_index.get(sector, [])
        brand_names = [b["name"] for b in sector_brands]

        return SectorStatus(
            sector=sector,
            health=health,
            status=status,
            brand_count=len(sector_brands),
            color=sector_data["color"],
            brands=brand_names
        )

    def get_template_metadata(self, template_id: str) -> Optional[TemplateMetadata]:
        """Get template metadata"""
        template = self.templates.get(template_id)

        if not template:
            return None

        return TemplateMetadata(
            template_id=template["template_id"],
            name=template["name"],
            type=template["type"],
            buildnest_location=template["buildnest_location"],
            features=template["features"],
            version=template["version"],
            estimated_deployment_time=template["estimated_deployment_time"]
        )

    def create_deployment_package(
        self,
        brand_id: str,
        custom_data: Optional[Dict] = None
    ) -> Optional[DeploymentPackage]:
        """
        Create complete deployment package for HotStack

        This is the CRITICAL function that enables 180-second deployment
        """

        # Get brand
        brand = self.get_brand_by_id(brand_id)
        if not brand:
            return None

        # Get template
        template = self.get_template_metadata(brand.template_id)
        if not template:
            return None

        # Get sector status
        sector_status = self.get_sector_status(brand.sector)
        if not sector_status:
            return None

        # Create deployment instructions
        deployment_instructions = {
            "phase_1_inhale": {
                "duration": 60,
                "actions": [
                    f"Pull template {template.template_id} from BuildNest",
                    f"Load template at: {template.buildnest_location}",
                    "Parse template structure",
                    "Validate template integrity"
                ]
            },
            "phase_2_hold": {
                "duration": 60,
                "actions": [
                    "Inject brand metadata",
                    "Apply custom data" if custom_data else "Use default data",
                    "Generate HTML/CSS/JS",
                    "Run pre-deployment validation"
                ]
            },
            "phase_3_exhale": {
                "duration": 60,
                "actions": [
                    f"Deploy to Replit: {brand.replit_app}",
                    "Update sector heatmap",
                    "Trigger 9s pulse cycle",
                    "Return deployment URL"
                ]
            }
        }

        # Add custom data to instructions if provided
        if custom_data:
            deployment_instructions["custom_data"] = custom_data

        return DeploymentPackage(
            brand=brand,
            template=template,
            sector_status=sector_status,
            deployment_instructions=deployment_instructions,
            estimated_time=180,
            pulse_cycle="9s"
        )

    def get_all_sectors(self) -> List[SectorStatus]:
        """Get all sector statuses for heatmap"""
        sectors = []
        for sector_name in self.sectors.keys():
            status = self.get_sector_status(sector_name)
            if status:
                sectors.append(status)

        # Sort by health (descending)
        sectors.sort(key=lambda x: x.health, reverse=True)
        return sectors


# ============================================================================
# FASTAPI APPLICATION
# ============================================================================

if FASTAPI_AVAILABLE:
    app = FastAPI(
        title="CodeNest Query API",
        description="Intelligent metadata bridge for OmniGrid ecosystem",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # CORS middleware for cross-origin requests from HotStack
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Initialize query engine
    query_engine = CodeNestQueryEngine()


    @app.get("/")
    async def root():
        """API root - health check"""
        return {
            "service": "CodeNest Query API",
            "status": "operational",
            "version": "1.0.0",
            "brands_loaded": len(query_engine.brands),
            "sectors_loaded": len(query_engine.sectors),
            "templates_loaded": len(query_engine.templates),
            "pulse_cycle": "9s",
            "timestamp": datetime.utcnow().isoformat()
        }


    @app.post("/query/intent", response_model=List[BrandMatch])
    async def query_intent(query: QueryIntent):
        """
        Query by business intent

        Example:
        {
            "intent": "I need a compliance dashboard for legal tracking",
            "sector_preference": "Legal_Tech_Compliance",
            "priority": "high"
        }
        """
        matches = query_engine.query_by_intent(query)

        if not matches:
            raise HTTPException(status_code=404, detail="No matching brands found")

        return matches


    @app.get("/brand/{brand_id}", response_model=BrandMatch)
    async def get_brand(brand_id: str):
        """Get specific brand by ID (e.g., FAA-001)"""
        brand = query_engine.get_brand_by_id(brand_id)

        if not brand:
            raise HTTPException(status_code=404, detail=f"Brand {brand_id} not found")

        return brand


    @app.get("/sector/{sector}", response_model=SectorStatus)
    async def get_sector(sector: str):
        """Get sector health status"""
        status = query_engine.get_sector_status(sector)

        if not status:
            raise HTTPException(status_code=404, detail=f"Sector {sector} not found")

        return status


    @app.get("/sectors/all", response_model=List[SectorStatus])
    async def get_all_sectors():
        """Get all sector statuses (for heatmap)"""
        return query_engine.get_all_sectors()


    @app.get("/template/{template_id}", response_model=TemplateMetadata)
    async def get_template(template_id: str):
        """Get template metadata"""
        template = query_engine.get_template_metadata(template_id)

        if not template:
            raise HTTPException(status_code=404, detail=f"Template {template_id} not found")

        return template


    @app.post("/deploy/package", response_model=DeploymentPackage)
    async def create_deployment(
        brand_id: str = Query(..., description="Brand ID (e.g., FAA-001)"),
        custom_data: Optional[Dict[str, Any]] = None
    ):
        """
        Create deployment package for HotStack

        This is the CRITICAL endpoint that enables 180-second deployment
        """
        package = query_engine.create_deployment_package(brand_id, custom_data)

        if not package:
            raise HTTPException(status_code=404, detail=f"Cannot create deployment package for {brand_id}")

        return package


    @app.get("/stats")
    async def get_stats():
        """Get API statistics"""
        return {
            "total_brands": len(query_engine.brands),
            "total_sectors": len(query_engine.sectors),
            "total_templates": len(query_engine.templates),
            "brands_by_sector": {
                sector: len(brands)
                for sector, brands in query_engine.sector_index.items()
            },
            "keyword_index_size": len(query_engine.keyword_index),
            "timestamp": datetime.utcnow().isoformat()
        }


# ============================================================================
# CLI INTERFACE
# ============================================================================

def main():
    """Run CodeNest Query API server"""

    if not FASTAPI_AVAILABLE:
        print("❌ FastAPI not installed")
        print("Install with: pip install fastapi uvicorn pydantic")
        return

    print("🚀 CodeNest Query API - Starting...")
    print("=" * 70)
    print(f"📊 Loaded {len(query_engine.brands)} brands")
    print(f"📊 Loaded {len(query_engine.sectors)} sectors")
    print(f"📊 Loaded {len(query_engine.templates)} templates")
    print("=" * 70)
    print("🌐 API Documentation: http://localhost:8000/docs")
    print("🌐 API Root: http://localhost:8000/")
    print("=" * 70)

    # Run server
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )


if __name__ == "__main__":
    main()
