# -*- coding: utf-8 -*-
import os
import json
import shutil # Added for shutil.rmtree
import textwrap # Added for textwrap.dedent

# Helper function to convert data to JS string safely
def to_js_str(data):
    """
    Escapes data (typically JSON-serialized) for embedding into JavaScript template literals (backticks).
    Handles backticks (`), dollar signs followed by curly braces (${), and triple single quotes (''').
    """
    escaped_json = json.dumps(data, indent=4)
    return escaped_json.replace("`", "\\`").replace("${", "\\${").replace("'''", "\\'\\'\\'")

# Helper function to escape a plain string for direct embedding into a JS template literal
def escape_js_template_literal_string(s):
    """
    Escapes a plain Python string for direct embedding into a JavaScript template literal.
    Handles backticks (`), and dollar signs followed by curly braces (${).
    """
    return s.replace("`", "\\`").replace("${", "\\${")

# Global JavaScript definitions for modal control and globally accessible data/functions
def generate_global_js_definitions(brand_content_data):
    """
    Generates the <script> block containing global JavaScript variables and functions.
    This script block is designed to be placed in the <head> of the HTML for early loading.
    Now takes brand_content_data directly.
    """
    product_details_map_for_js = {p['id']: p for p in brand_content_data.get('products_data', [])}
    features_deep_dive_data_for_js = brand_content_data.get('features_deep_dive', [])
    integration_capabilities_data_for_js = brand_content_data.get('integration_capabilities', [])
    use_cases_data_for_js = brand_content_data.get('use_cases_data', [])
    tech_specs_data_for_js = brand_content_data.get('tech_specs_data', {})
    security_compliance_data_for_js = brand_content_data.get('security_compliance_data', [])
    customer_success_stories_for_js = brand_content_data.get('customer_success_stories', [])
    support_training_data_for_js = brand_content_data.get('support_training_data', [])
    # FAQ and Pricing Overview are handled in generate_js_for_page now or can be added here if globally needed
    faq_data_for_js = brand_content_data.get('faq_data', [])
    pricing_overview_content_for_js = brand_content_data.get('pricing_overview_content', '')


    return textwrap.dedent(f"""
<script>
    // Global function to hide the product detail modal
    window.hideProductModal = function() {{
        const modal = document.getElementById('productDetailModal');
        if (modal) {{
            modal.style.display = 'none';
            document.body.classList.remove('modal-open'); // Ensure body scroll is re-enabled
            document.body.style.overflow = '';
        }}
    }};

    // Global data for product details and other sections (used by products.html)
    // These are passed as JSON strings from Python and parsed by JS.
    // The `to_js_str` function ensures they are correctly escaped for JS.
    window.productDetailsMap = {to_js_str(product_details_map_for_js)};
    window.featuresDeepDiveData = {to_js_str(features_deep_dive_data_for_js)};
    window.integrationCapabilitiesData = {to_js_str(integration_capabilities_data_for_js)};
    window.useCasesData = {to_js_str(use_cases_data_for_js)};
    window.techSpecsData = {to_js_str(tech_specs_data_for_js)};
    window.securityComplianceData = {to_js_str(security_compliance_data_for_js)};
    window.customerSuccessStories = {to_js_str(customer_success_stories_for_js)};
    window.supportTrainingData = {to_js_str(support_training_data_for_js)};
    window.faqData = {to_js_str(faq_data_for_js)};
    window.pricingOverviewContent = `{escape_js_template_literal_string(pricing_overview_content_for_js)}`;


    window.fetchProductDetails = async function(productId) {{ // Make global for onclick
        const productDetails = window.productDetailsMap[productId]; // Access global map
        if (productDetails) {{
            // Populate modal fields
            document.getElementById('modalProductTitle').textContent = productDetails.name || 'Product Title';
            document.getElementById('modalProductDescription').textContent = productDetails.description || 'Product description goes here.';
            
            // Set product image if available
            const modalProductImage = document.getElementById('modalProductImage');
            if (modalProductImage && productDetails.image) {{
                modalProductImage.src = productDetails.image;
                modalProductImage.style.display = 'block'; // Ensure image is visible
            }} else if (modalProductImage) {{
                modalProductImage.style.display = 'none'; // Hide if no image
            }}

            // Set CTA link
            const modalProductCTA = document.getElementById('modalProductCTA');
            if (modalProductCTA && productDetails.cta_link) {{
                modalProductCTA.href = productDetails.cta_link;
                modalProductCTA.style.display = 'inline-block'; // Show button
            }} else if (modalProductCTA) {{
                modalProductCTA.style.display = 'none'; // Hide button
            }}
            
            const populateList = (elementId, items) => {{
                const parentDiv = document.getElementById(elementId);
                const ul = parentDiv.querySelector('ul');
                ul.innerHTML = '';
                if (items && items.length > 0) {{
                    parentDiv.style.display = 'block';
                    items.forEach(item => {{
                        const li = document.createElement('li');
                        li.textContent = item;
                        ul.appendChild(li);
                    }});
                }} else {{
                    parentDiv.style.display = 'none';
                }}
            }};

            const populateSpecs = (elementId, specs) => {{
                const parentDiv = document.getElementById(elementId);
                const ul = parentDiv.querySelector('ul');
                ul.innerHTML = '';
                if (specs && Object.keys(specs).length > 0) {{
                    parentDiv.style.display = 'block';
                    for (const key in specs) {{
                        const li = document.createElement('li');
                        li.innerHTML = `<strong>$${{key}}</strong>: $${{specs[key]}}`; // Correctly escaped for JS template literal
                        ul.appendChild(li);
                    }}
                }} else {{
                    parentDiv.style.display = 'none';
                }}
            }};

            populateList('modalProductFeatures', productDetails.features);
            populateSpecs('modalProductSpecs', productDetails.specs);
            populateList('modalProductBenefits', productDetails.benefits);
            populateList('modalProductUseCases', productDetails.use_cases);
            
            document.getElementById('modalProductPricing').textContent = `Pricing: $${{productDetails.pricing || 'Contact for Quote'}}`;
            
            // Show the modal
            document.getElementById('productDetailModal').style.display = 'flex';
            document.body.classList.add('modal-open'); // Add class to body
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
        }} else {{
            console.error(`Product details for ID $${{productId}} not found in mock data.`);
            alert('Product details not found.');
        }}
    }};
    document.addEventListener('DOMContentLoaded', () => {{
        const productModal = document.getElementById('productDetailModal');
        if (productModal) {{
            productModal.addEventListener('click', function(event) {{
                // If clicked directly on the modal background or a close button
                if (event.target === productModal || event.target.closest('.product-modal-close') || event.target.closest('.close-modal-button')) {{
                    window.hideProductModal();
                }}
            }});
        }}
    }});
</script>
""").strip()

# --- Configuration for HTML Generation ---
OUTPUT_DIR = "generated_pages" # Where the HTML files will be saved
# CRITICAL: This is the base path for your deployed GitHub Pages/Vercel site
BASE_PUBLIC_PATH = "/public/sectors" 
# Define the absolute path to your main Admin Portal from the web server's root
ADMIN_PORTAL_ABSOLUTE_PATH = "/admin/admin-portal.html"


# --- UPDATED: SECTOR_DATA_FOR_GENERATION with brand-specific content ---
# This is now the single source of truth for all brand-specific data
SECTOR_DATA_FOR_GENERATION = {
    "agriculture": {
        "brands": [
            {"name": "CropLink", "brand_icon": "🔗"},
            {"name": "SoilPulse", "brand_icon": "🌱"},
            {"name": "AgriMesh", "brand_icon": "📡"}
        ],
        "subNodes": [["ID", "Vault"], ["Trace", "Data"], ["Route", "Pulse"]],
        "ci_color": "emerald",
        "sector_icon": "🌱"
    },
    "banking": {
        "brands": [
            {"name": "FinGrid", "brand_icon": "🔲"},
            {"name": "VaultMaster", "brand_icon": "🔐"},
            {"name": "OmniBank", "brand_icon": "🏦"}
        ],
        "subNodes": [["Ledger", "Router"], ["Lock", "Matrix"], ["NanoPay", "Score"]],
        "ci_color": "indigo",
        "sector_icon": "🏦"
    },
    "creative": {
        "brands": [
            {"name": "MediaGrid", "brand_icon": "🎬"},
            {"name": "StudioPath", "brand_icon": "🖋️"},
            {"name": "FXStream", "brand_icon": "✨"}
        ],
        "subNodes": [["SceneLink", "FXLayer"], ["StudioSync", "RenderMesh"], ["RenderFX", "LoopFrame"]],
        "ci_color": "purple",
        "sector_icon": "🖋️"
    },
    "packaging-logistics": { # Corrected sector key for live server
        "brands": [
            {"name": "RouteMesh", "brand_icon": "🌐"},
            {"name": "PackChain", "brand_icon": "📦"},
            {"name": "CrateLogic", "brand_icon": "📊"}
        ],
        "subNodes": [["RouteOpt", "DeliveryAI"], ["LabelFlow", "TraceSync"], ["BoxNode", "CrateMap"]],
        "ci_color": "cyan",
        "sector_icon": "📦"
    },
    "education-ip": {
        "brands": [
            {"name": "EduNest", "brand_icon": "📚"},
            {"name": "LearnMesh", "brand_icon": "🔗"},
            {"name": "SkillCast", "brand_icon": "🎓"}
        ],
        "subNodes": [["VaultEdu", "Certify"], ["IDTrack", "PupilMesh"], ["YouthForge", "QuizNet"]],
        "ci_color": "teal",
        "sector_icon": "📚"
    },
    "fashion": {
        "brands": [
            {"name": "StyleForm", "brand_icon": "✂️"},
            {"name": "ChicClaim", "brand_icon": "🏷️"},
            {"name": "GlamRoot", "brand_icon": "💎"}
        ],
        "subNodes": [["FitTrack", "TrendCast"], ["VogueSync", "RunwayPulse"], ["LuxLink", "ModeFrame"]],
        "ci_color": "pink",
        "sector_icon": "✂"
    },
    "gaming": {
        "brands": [
            {"name": "GameFlow", "brand_icon": "🎮"},
            {"name": "MetaPlay", "brand_icon": "🎲"},
            {"name": "SimulateX", "brand_icon": "🤖"}
        ],
        "subNodes": [["Engine", "AI"], ["Render", "Logic"], ["Virtual", "World"]],
        "ci_color": "blue",
        "sector_icon": "🎮"
    },
    "health": {
        "brands": [
            {"name": "MedVault", "brand_icon": "⚕️"},
            {"name": "CareNode", "brand_icon": "🏥"},
            {"name": "Hygienix", "brand_icon": "🧼"}
        ],
        "subNodes": [["ScanID", "PatientDrop"], ["SteriMesh", "BioPulse"], ["CleanCast", "SanitiPath"]],
        "ci_color": "emerald",
        "sector_icon": "🧠"
    },
    "housing": {
        "brands": [
            {"name": "BuildNest", "brand_icon": "🏗️"},
            {"name": "InfraGrid", "brand_icon": "🛣️"},
            {"name": "UrbanTrace", "brand_icon": "🏙️"}
        ],
        "subNodes": [["PlotVault", "Permit"], ["Frame", "Struct"], ["LandClaim", "Mesh"]],
        "ci_color": "slate",
        "sector_icon": "🏗️"
    },
    "justice": {
        "brands": [
            {"name": "LawTrace", "brand_icon": "⚖️"},
            {"name": "RegiSync", "brand_icon": "📜"},
            {"name": "AuditGuard", "brand_icon": "🛡️"}
        ],
        "subNodes": [["CaseFlow", "EthicAI"], ["Compliance", "Ledger"], ["Trail", "Verify"]],
        "ci_color": "rose",
        "sector_icon": "⚖"
    },
    "knowledge": {
        "brands": [
            {"name": "MindLift", "brand_icon": "🧠"},
            {"name": "ArchiveX", "brand_icon": "🗃️"},
            {"name": "KnowledgeGrid", "brand_icon": "🌐"}
        ],
        "subNodes": [["DataNode", "InfoSync"], ["VaultSearch", "ReadLink"], ["MeshIndex", "LearnFlow"]],
        "ci_color": "amber",
        "sector_icon": "📖"
    },
    "micromesh": {
        "brands": [
            {"name": "MicroLogi", "brand_icon": "🔬"},
            {"name": "GridDrop", "brand_icon": "⬇️"},
            {"name": "FlowStack", "brand_icon": "☰"}
        ],
        "subNodes": [["NanoRoute", "Packet"], ["SensorSync", "Beacon"], ["Trace", "Distro"]],
        "ci_color": "purple",
        "sector_icon": "☰"
    },
    "media": {
        "brands": [
            {"name": "SonicGrid", "brand_icon": "🎧"},
            {"name": "VoiceLoop", "brand_icon": "🎙️"},
            {"name": "EditMesh", "brand_icon": "🎞️"}
        ],
        "subNodes": [["AudioNode", "QRMix"], ["QRVoice", "ScrollPath"], ["ClipLayer", "TimeSync"]],
        "ci_color": "gray",
        "sector_icon": "🎬"
    },
    "nutrition": {
        "brands": [
            {"name": "FreshSync", "brand_icon": "🍎"},
            {"name": "CropLoop", "brand_icon": "♻️"},
            {"name": "YieldField", "brand_icon": "🌾"}
        ],
        "subNodes": [["SoilTrace", "PlantLink"], ["HarvestClaim", "GrainVault"], ["RootMap", "FoodProof"]],
        "ci_color": "green",
        "sector_icon": "✿"
    },
    "ai-logic": {
        "brands": [
            {"name": "OmniKey", "brand_icon": "🔑"},
            {"name": "SignalPulse", "brand_icon": "🧠"},
            {"name": "LogicEcho", "brand_icon": "🤖"}
        ],
        "subNodes": [["MeshIndex", "ClaimNode"], ["TokenBoard", "GridCast"], ["VaultGrid", "TraceLoop"]],
        "ci_color": "indigo",
        "sector_icon": "🧠"
    },
    "packaging": {
        "brands": [
            {"name": "PackChain", "brand_icon": "📦"},
            {"name": "CrateWrap", "brand_icon": "🎁"},
            {"name": "LabelFlow", "brand_icon": "🏷️"}
        ],
        "subNodes": [["SortFleet", "RouteMesh"], ["ColdFleet", "BinLogic"], ["Track", "Dispatch"]],
        "ci_color": "yellow",
        "sector_icon": "📦"
    },
    "quantum": {
        "brands": [
            {"name": "QuantumMesh", "brand_icon": "⚛️"},
            {"name": "QubitNest", "brand_icon": "✴️"},
            {"name": "LogicSpin", "brand_icon": "🌀"}
        ],
        "subNodes": [["PulseQ", "EntanglePath"], ["WaveSignal", "PhaseClaim"], ["GridState", "QuantumDrop"]],
        "ci_color": "fuchsia",
        "sector_icon": "✴️"
    },
    "ritual": {
        "brands": [
            {"name": "RiteNest", "brand_icon": "☯️"},
            {"name": "ClanScroll", "brand_icon": "📜"},
            {"name": "MythLoop", "brand_icon": "✨"}
        ],
        "subNodes": [["PulseSpirit", "AuraDrop"], ["CeremPath", "EchoGlyph"], ["TradVault", "LineageClaim"]],
        "ci_color": "neutral",
        "sector_icon": "☯"
    },
    "saas": {
        "brands": [
            {"name": "SaaSChain", "brand_icon": "🔗"},
            {"name": "LicenseGrid", "brand_icon": "🔐"},
            {"name": "VaultKey", "brand_icon": "🔑"}
        ],
        "subNodes": [["TokenSaaS", "OmniLicense"], ["ScrollSync", "PulseSaaS"], ["ClaimSuite", "YieldKey"]],
        "ci_color": "sky",
        "sector_icon": "🔑"
    },
    "trade": {
        "brands": [
            {"name": "TradeSys", "brand_icon": "🧺"},
            {"name": "ExchangeLink", "brand_icon": "🤝"},
            {"name": "MarketLoop", "brand_icon": "📈"}
        ],
        "subNodes": [["Contract", "Verify"], ["GlobalRoute", "Audit"], ["Pulse", "Sync"]],
        "ci_color": "orange",
        "sector_icon": "🧺"
    },
    "utilities": {
        "brands": [
            {"name": "EnergyGrid", "brand_icon": "🔋"},
            {"name": "WaterFlow", "brand_icon": "💧"},
            {"name": "PowerPulse", "brand_icon": "⚡"}
        ],
        "subNodes": [["SmartMeter", "Connect"], ["HydroTech", "PipeNet"], ["SolarSync", "GridTie"]],
        "ci_color": "blue",
        "sector_icon": "🔋"
    },
    "voice": {
        "brands": [
            {"name": "VoiceFlow", "brand_icon": "🎙️"},
            {"name": "AudioSync", "brand_icon": "🎚️"},
            {"name": "SonicCast", "brand_icon": "📢"}
        ],
        "subNodes": [["SpeechRec", "SynthAI"], ["WaveTrace", "EchoNode"], ["MediaPipe", "AudioGrid"]],
        "ci_color": "indigo",
        "sector_icon": "🎙️"
    },
    "webless": {
        "brands": [
            {"name": "OmniQR", "brand_icon": "📡"},
            {"name": "MeshSync", "brand_icon": "📶"},
            {"name": "VaultBeacon", "brand_icon": "🚨"}
        ],
        "subNodes": [["TapClaim", "ScrollKey"], ["AirLoop", "DotGrid"], ["VaultTouch", "PouchCast"]],
        "ci_color": "slate",
        "sector_icon": "📡"
    },
    "nft": {
        "brands": [
            {"name": "ClaimGrid", "brand_icon": "🖼️"},
            {"name": "TokenSync", "brand_icon": "🔁"},
            {"name": "VaultMint", "brand_icon": "🪙"}
        ],
        "subNodes": [["NFTLoop", "ScrollProof"], ["IPTrace", "MintEcho"], ["VaultSeal", "ChainLock"]],
        "ci_color": "fuchsia",
        "sector_icon": "🔁"
    },
    "education-youth": {
        "brands": [
            {"name": "EduHub", "brand_icon": "🎓"},
            {"name": "YouthLab", "brand_icon": "🧪"},
            {"name": "LearnZone", "brand_icon": "📚"}
        ],
        "subNodes": [["ClassSync", "SkillTrack"], ["MentorLink", "QuizNet"], ["GrowthMap", "IdeaNest"]],
        "ci_color": "emerald",
        "sector_icon": "🎓"
    },
    "zerowaste": {
        "brands": [
            {"name": "EcoLoop", "brand_icon": "♻️"},
            {"name": "CycleSync", "brand_icon": "🔄"},
            {"name": "WasteGrid", "brand_icon": "🗑️"}
        ],
        "subNodes": [["BioDrop", "SustainClaim"], ["Sort", "PulseGreen"], ["YieldTrash", "RecycleMap"]],
        "ci_color": "lime",
        "sector_icon": "♻️"
    },
    "professional": {
        "brands": [
            {"name": "LedgerNest", "brand_icon": "🧾"},
            {"name": "OmniBooks", "brand_icon": "💼"},
            {"name": "LawTrace", "brand_icon": "⚖️"}
        ],
        "subNodes": [["QCalc", "SiteProof"], ["ContractCast", "Enginuity"], ["StructVault", "RegiSync"]],
        "ci_color": "indigo",
        "sector_icon": "🧾"
    },
    "payroll-mining": {
        "brands": [
            {
                "name": "PayMine",
                "brand_icon": "🪙",
                "products_data": [ # Specific product data for PayMine
                    {"id": "pm_payroll_pro", "icon": "💰", "name": "PayrollPro™", "description": "Automated payroll processing and compliance.",
                     "features": ["Automated Tax Calculations", "Employee Self-Service Portal"],
                     "specs": {"Capacity": "Unlimited Employees", "Integrations": "HRM, Accounting"},
                     "benefits": ["Reduce administrative burden", "Ensure compliance"],
                     "use_cases": ["Small businesses", "Large enterprises"],
                     "pricing": "Custom Quote",
                     "modal_content": "<h4>PayMine PayrollPro™</h4><p>Streamline your payroll with our intelligent automation, ensuring accuracy and compliance.</p>",
                     "image": "/assets/images/product-card-payroll.jpg",
                     "cta_link": "/paymine-payroll-pro"
                    },
                    {"id": "pm_mine_track", "icon": "⛏️", "name": "MineTrack™ Compliance", "description": "Real-time mining industry compliance monitoring.",
                     "features": ["Regulatory Alerts", "Audit Trail"],
                     "specs": {"Data Sources": "IoT, Manual Inputs", "Reporting": "Customizable"},
                     "benefits": ["Avoid penalties", "Improve safety records"],
                     "use_cases": ["Mining operations", "Regulatory bodies"],
                     "pricing": "Contact Sales",
                      "modal_content": """<h4>PayMine MineTrack™ Compliance</h4><p>Ensure your mining operations adhere to all local and international regulations with real-time monitoring and reporting, improving safety records and avoiding costly penalties.</p>""",
                     "image": "/assets/images/product-card-mining.jpg",
                     "cta_link": "/paymine-minetrack"
                    }
                ],
                "features_deep_dive": [
                    {"title": "Automated Tax Calculation", "description": "Ensures accurate and timely tax deductions.", "icon": "🧮"},
                    {"title": "Employee Self-Service", "description": "Empower employees with access to their pay stubs and tax documents.", "icon": "🧑‍💻"}
                ],
                "integration_capabilities": [
                    {"name": "HRM Systems", "description": "Seamlessly integrate with leading Human Resource Management platforms.", "icon": "🤝"},
                    {"name": "Accounting Software", "description": "Connect with your accounting software for unified financial reporting.", "icon": "📊"}
                ],
                "use_cases_data": [
                    {"title": "SME Payroll", "description": "Perfect for small to medium enterprises needing efficient payroll solutions.", "icon": "🏢"},
                    {"title": "Multi-National Companies", "description": "Handle complex payroll structures across different regions.", "icon": "🌍"}
                ],
                "tech_specs_data": {
                    "Platform": "Cloud-based",
                    "Security": "AES-256 Encryption",
                    "Accessibility": "Web & Mobile App"
                },
                "security_compliance_data": [
                    "SARS Compliant",
                    "POPIA Compliant",
                    "Regular Security Audits"
                ],
                "customer_success_stories": [
                    {"name": "MineCo Ltd.", "quote": "PayMine transformed our payroll process, saving us countless hours and ensuring compliance.", "industry": "Mining"},
                    {"name": "TechStart Inc.", "quote": "The employee self-service portal is a game-changer for our team.", "industry": "Technology"}
                ],
                "support_training_data": [
                    {"title": "Dedicated Account Manager", "description": "Personalized support for your unique payroll needs.", "icon": "👨‍💼"},
                    {"title": "Online Knowledge Base", "description": "Extensive resources for self-help and learning.", "icon": "📚"}
                ],
                "faq_data": [
                    {"question": "Is PayMine suitable for small businesses?", "answer": "Yes, PayMine is scalable and offers plans tailored for businesses of all sizes, from startups to large enterprises."},
                    {"question": "How often are tax regulations updated in the system?", "answer": "Our system is continuously updated to reflect the latest tax laws and compliance regulations automatically."}
                ],
                "pricing_overview_content": """
                    <p class="text-gray-300 text-lg mb-4">PayMine offers tiered pricing based on the number of employees and required features. All plans include essential payroll processing and compliance tools.</p>
                    <ul class="list-disc list-inside text-gray-300 text-base mb-6">
                        <li><strong>Basic Plan:</strong> For small teams with core payroll needs.</li>
                        <li><strong>Pro Plan:</strong> Advanced features for growing businesses, including integrations.</li>
                        <li><strong>Enterprise Plan:</strong> Custom solutions for large organizations with complex requirements.</li>
                    </ul>
                    <a href="contact.html" class="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-6 rounded-md transition-colors duration-200">Request a Custom Quote</a>
                """,
                "custom_pages": [
                    {
                        "name": "Payroll Process Flow",
                        "slug": "payroll-flow",
                        "hero_icon": "➡️",
                        "title_suffix": "Our Streamlined Approach",
                        "content": {
                            "heading": "Experience Effortless Payroll with PayMine",
                            "paragraphs": [
                                "Our payroll process is designed for simplicity and efficiency, ensuring your team is paid accurately and on time, every time.",
                                "From data input to payslip generation and tax filing, every step is automated and transparent."
                            ],
                            "key_benefits": [
                                "Automated data import",
                                "One-click payroll processing",
                                "Direct deposit capabilities",
                                "Comprehensive reporting"
                            ],
                            "image": "/assets/images/payroll-flow-diagram.jpg" # Example image
                        }
                    }
                ]
            },
            {
                "name": "AccountCore",
                "brand_icon": "🧮",
                "products_data": [],
                "features_deep_dive": [],
                "integration_capabilities": [],
                "use_cases_data": [],
                "tech_specs_data": {},
                "security_compliance_data": [],
                "customer_success_stories": [],
                "support_training_data": [],
                "faq_data": [],
                "pricing_overview_content": "",
                "custom_pages": []
            }
        ],
        "subNodes": [["HashLedger", "BlockTrack"], ["MintClaim", "Audit"]],
        "ci_color": "amber",
        "sector_icon": "🪙"
    },
    "mining": {
        "brands": [
            {"name": "MineNest", "brand_icon": "⛏️"},
            {"name": "DrillCore", "brand_icon": "🔩"}
        ],
        "subNodes": [["VaultRock", "ClaimMine"], ["TrackShaft", "PulseMine"]],
        "ci_color": "orange",
        "sector_icon": "⛏️"
    },
    "wildlife": {
        "brands": [
            {"name": "HabitatGuard", "brand_icon": "🦁"},
            {"name": "EcoWild", "brand_icon": "🌿"},
            {"name": "ZoneProtect", "brand_icon": "🏞️"}
        ],
        "subNodes": [["TraceCam", "BioShield"], ["TrackFlow", "SanctuaryAI"], ["PreserveNet", "FloraGuard"]],
        "ci_color": "green",
        "sector_icon": "🦁"
    },
    "financial-services": { # Example of adding detailed data
        "brands": [
            {
                "name": "King Price",
                "brand_icon": "👑",
                "products_data": [ # Specific product data for King Price
                    {"id": "kp_car_insurance", "icon": "🚗", "name": "King Price Car Insurance", "description": "Get car insurance that decreases monthly.",
                     "features": ["Daily Decreasing Premiums", "Emergency Roadside Assistance", "Hail Cover"],
                     "specs": {"Policy Type": "Comprehensive", "Excess": "Standard", "Underwriter": "KP Underwriters"},
                     "benefits": ["Save money every month", "24/7 support", "Flexible options"],
                     "use_cases": ["Personal vehicles", "Fleet management"],
                     "pricing": "From R500/month",
                     "modal_content": "<h4>King Price Car Insurance</h4><p>Your premium decreases every month as your car's value depreciates, ensuring you never overpay. We offer comprehensive coverage for accidents, theft, and natural disasters, with 24/7 roadside assistance.</p>",
                     "image": "/assets/images/kp-car-insurance.jpg", # Example image path
                     "cta_link": "/get-car-quote"
                    },
                    {"id": "kp_home_insurance", "icon": "🏠", "name": "King Price Home Insurance", "description": "Protect your home and belongings with flexible cover.",
                     "features": ["Building & Contents Cover", "Accidental Damage Option", "Home Emergency Services"],
                     "specs": {"Policy Type": "All-risk", "Sum Insured": "Customizable", "Optional": "Gadget Cover"},
                     "benefits": ["Peace of mind", "Tailored solutions", "Quick claims process"],
                     "use_cases": ["Homeowners", "Renters"],
                     "pricing": "From R800/month",
                     "modal_content": "<h4>King Price Home Insurance</h4><p>Comprehensive protection for your most valuable asset. Cover against fire, theft, natural disasters, and accidental damage to both your building and its contents.</p>",
                     "image": "/assets/images/kp-home-insurance.jpg", # Example image path
                     "cta_link": "/get-home-quote"
                    }
                ],
                "features_deep_dive": [ # Specific features for King Price
                    {"title": "Decreasing Premiums", "description": "Your car insurance premium gets cheaper every month as your car's value depreciates.", "icon": "📉"},
                    {"title": "Tiered Excess Options", "description": "Choose an excess that suits your budget and risk appetite.", "icon": "💸"},
                    {"title": "Award-Winning Claims", "description": "Experience a fast, fair, and empathetic claims process.", "icon": "🏆"}
                ],
                "integration_capabilities": [
                    {"name": "Banking Integration", "description": "Seamless premium deductions and claims payouts via direct bank links.", "icon": "🏦"},
                    {"name": "Telematics Ready", "description": "Integrate with telematics devices for personalized driving behavior discounts.", "icon": "📡"}
                ],
                "use_cases_data": [
                    {"title": "Personal Vehicle Owners", "description": "Comprehensive cover for everyday drivers seeking value and reliability.", "icon": "🧑‍🚗"},
                    {"title": "Homeowners & Renters", "description": "Tailored policies to protect your primary residence and personal belongings.", "icon": "🏡"}
                ],
                "tech_specs_data": {
                    "Platform": "Mobile App & Web Portal",
                    "Security": "256-bit SSL Encryption",
                    "Support": "AI Chatbot & Live Agents"
                },
                "security_compliance_data": [
                    "FSCA Regulated",
                    "POPIA Compliant Data Handling",
                    "Data Encryption at Rest and In Transit",
                    "Regular Vulnerability Assessments"
                ],
                "customer_success_stories": [
                    {"name": "King Family", "quote": "King Price made insurance easy and saved us a lot! Their service is top-notch.", "industry": "Household"},
                    {"name": "Local Business XYZ", "quote": "Their business insurance provides peace of mind, allowing us to focus on growth.", "industry": "SME"}
                ],
                "support_training_data": [
                    {"title": "24/7 Emergency Assistance", "description": "Always available for roadside or home emergencies.", "icon": "🚨"},
                    {"title": "Dedicated Policy Advisor", "description": "A personal advisor to guide you through your policy options.", "icon": "🙋"},
                    {"title": "Online Resource Hub", "description": "Access to FAQs, policy documents, and claims guides.", "icon": "📚"}
                ],
                "faq_data": [
                    {"question": "How do decreasing premiums work?", "answer": "Your premium decreases every month because the value of your car depreciates, so you pay less for the same cover as your asset ages."},
                    {"question": "Can I get immediate cover?", "answer": "Yes, in most cases, you can get immediate cover once your application is approved and payment is made."},
                    {"question": "What is covered under accidental damage?", "answer": "Accidental damage covers damages to your vehicle due to unforeseen incidents like collisions, overturning, or impact with objects."}
                ],
                "pricing_overview_content": """
                    <p class="text-gray-300 text-lg mb-4">King Price offers personalized insurance quotes tailored to your specific needs and risk profile. Get a quick online quote or speak to an advisor to find the best plan for you.</p>
                    <ul class="list-disc list-inside text-gray-300 text-base mb-6">
                        <li><strong>Car Insurance:</strong> Comprehensive, Third-Party, Fire & Theft, and Third-Party Only options.</li>
                        <li><strong>Home Insurance:</strong> Building, Contents, and All-Risk for specified items.</li>
                        <li><strong>Business Insurance:</strong> Tailored solutions for various business sizes and industries.</li>
                    </ul>
                    <a href="pricing.html" class="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-6 rounded-md transition-colors duration-200">Get a Free Quote Now</a>
                """,
                "custom_pages": [ # Example of a custom page for King Price
                    {
                        "name": "Why King Price?",
                        "slug": "why-kp",
                        "hero_icon": "🏆",
                        "title_suffix": "Our Unique Edge",
                        "content": {
                            "heading": "Why Choose King Price for Your Insurance Needs?",
                            "paragraphs": [
                                "At King Price, we believe in fairness and transparency. Our unique decreasing premium model ensures you always get the best value.",
                                "We offer award-winning customer service and a simplified claims process, making your insurance experience hassle-free."
                            ],
                            "key_benefits": [
                                "Monthly decreasing premiums",
                                "All-risk cover options",
                                "Exceptional client support",
                                "Transparent policies",
                                "Hassle-free claims"
                            ],
                            "image": "/assets/images/why-kp-hero.jpg" # Example image
                        }
                    },
                    {
                        "name": "Claims Process",
                        "slug": "claims-process",
                        "hero_icon": "✅",
                        "title_suffix": "Seamless Claims",
                        "content": {
                            "heading": "Our Easy 3-Step Claims Process",
                            "paragraphs": [
                                "We understand that making a claim can be stressful. That's why we've made our process as simple and straightforward as possible.",
                                "Follow these easy steps to get your claim processed quickly and efficiently."
                            ],
                            "steps": [
                                {"title": "Step 1: Report Your Claim", "description": "Contact us immediately after the incident via phone or our app."},
                                {"title": "Step 2: Provide Documentation", "description": "Submit necessary documents like police reports, photos, or medical records."},
                                {"title": "Step 3: Assessment & Payout", "description": "Our expert team assesses your claim, and once approved, we process your payout quickly."}
                            ],
                            "image": "/assets/images/claims-process.jpg"
                        }
                    }
                ]
            },
            {
                "name": "MineNest Auth",
                "brand_icon": "🔑",
                "products_data": [
                    {"id": "mn_authflow_pro", "icon": "🔒", "name": "AuthFlow™ Pro", "description": "Advanced authentication and user management.",
                     "features": ["Multi-factor authentication", "SSO integration", "User analytics"],
                     "specs": {"API": "RESTful", "Scalability": "High-throughput"},
                     "benefits": ["Enhanced security", "Streamlined access"],
                     "use_cases": ["Enterprise logins", "Customer authentication"],
                     "pricing": "$99/month",
                     "modal_content": "<h4>MineNest AuthFlow™ Pro</h4><p>Provides enterprise-grade authentication features including MFA, SSO, and detailed user activity logs for comprehensive security.</p>",
                     "image": "/assets/images/authflow-pro.png",
                     "cta_link": "/authflow-pro-details"
                    },
                    {"id": "mn_vaultkey_ess", "icon": "🔐", "name": "VaultKey™ Essentials", "description": "Secure API key and secret management.",
                     "features": ["Key Rotation", "Access Control"],
                     "specs": {"Encryption": "AES-256", "Audit Logs": "Comprehensive"},
                     "benefits": ["Reduce data breaches", "Automate key management"],
                     "use_cases": ["Developer teams", "DevOps environments"],
                     "pricing": "$49/month",
                     "modal_content": "<h4>MineNest VaultKey™ Essentials</h4><p>Simplifies the management and security of your API keys and secrets, protecting sensitive data from unauthorized access and ensuring compliance.</p>",
                     "image": "/assets/images/vaultkey-ess.png",
                     "cta_link": "/vaultkey-ess-details"
                    }
                ],
                "features_deep_dive": [
                    {"title": "Biometric Authentication", "description": "Support for fingerprint and facial recognition for seamless logins.", "icon": "👤"},
                    {"title": "Adaptive Security", "description": "Adjusts security measures based on user behavior and context.", "icon": "🛡️"}
                ],
                "integration_capabilities": [
                    {"name": "OAuth 2.0 & OpenID Connect", "description": "Standard-compliant integrations for various applications.", "icon": "🔗"}
                ],
                "use_cases_data": [
                    {"title": "Customer Identity Management", "description": "Securely manage millions of customer identities.", "icon": "👥"}
                ],
                "tech_specs_data": {"Compliance": "GDPR, CCPA"},
                "security_compliance_data": ["SOC 2 Type II Certified"],
                "customer_success_stories": [],
                "support_training_data": [],
                "faq_data": [],
                "pricing_overview_content": "",
                "custom_pages": []
            }
        ],
        "subNodes": [["Ledger", "Router"], ["Lock", "Matrix"], ["NanoPay", "Score"]],
        "ci_color": "indigo",
        "sector_icon": "🏦"
    }

}

BRAND_PAGE_TYPES = [
    {"file": "index.html", "title_suffix": "Home", "nav_label": "Home", "hero_icon": "🏡"},
    {"file": "dashboard.html", "title_suffix": "Dashboard", "nav_label": "Dashboard", "hero_icon": "📊"},
    {"file": "pricing.html", "title_suffix": "Pricing & Plans", "nav_label": "Pricing", "hero_icon": "💰"},
    {"file": "products.html", "title_suffix": "Solutions & Modules", "nav_label": "Products", "hero_icon": "📦"},
    {"file": "about.html", "title_suffix": "About Us", "nav_label": "About", "hero_icon": "ℹ️"},
    {"file": "features.html", "title_suffix": "Key Features", "nav_label": "Features", "hero_icon": "✨"},
    {"file": "contact.html", "title_suffix": "Contact Support", "nav_label": "Contact", "hero_icon": "📞"},
    {"file": "licensing.html", "title_suffix": "Licensing", "nav_label": "Licensing", "hero_icon": "🔐"},
    {"file": "terms.html", "title_suffix": "Terms of Service", "nav_label": "Terms", "hero_icon": "📜"},
    {"file": "clauses.html", "title_suffix": "Compliance Clauses", "nav_label": "Clauses", "hero_icon": "⚖️"},
    {"file": "auth.html", "title_suffix": "Authentication Portal", "nav_label": "Auth", "hero_icon": "🔑"},
    {"file": "metrics.html", "title_suffix": "Performance Metrics", "nav_label": "Metrics", "hero_icon": "📈"},
]

CI_COLOR_MAP = {
    "indigo":   {"header_bg": "bg-indigo-800", "accent_text": "text-indigo-400",   "button_bg": "bg-indigo-600", "hover_button_bg": "hover:bg-indigo-700", "accent_500": "indigo-500"},
    "blue":     {"header_bg": "bg-blue-800",   "accent_text": "text-blue-400",     "button_bg": "bg-blue-600",   "hover_button_bg": "hover:bg-blue-700",   "accent_500": "blue-500"},
    "cyan":     {"header_bg": "bg-cyan-800",   "accent_text": "text-cyan-400",     "button_bg": "bg-cyan-600",   "hover_button_bg": "hover:bg-cyan-700",   "accent_500": "cyan-500"},
    "teal":     {"header_bg": "bg-teal-800",   "accent_text": "text-teal-400",     "button_bg": "bg-teal-600",   "hover_button_bg": "hover:bg-teal-700",   "accent_500": "teal-500"},
    "emerald":  {"header_bg": "bg-emerald-800","accent_text": "text-emerald-400",  "button_bg": "bg-emerald-600","hover_button_bg": "hover:bg-emerald-700","accent_500": "emerald-500"},
    "green":    {"header_bg": "bg-green-800",  "accent_text": "text-green-400",    "button_bg": "bg-green-600",  "hover_button_bg": "hover:bg-green-700",  "accent_500": "green-500"},
    "lime":     {"header_bg": "bg-lime-800",   "accent_text": "text-lime-400",     "button_bg": "bg-lime-600",   "hover_button_bg": "hover:bg-lime-700",   "accent_500": "lime-500"},
    "yellow":   {"header_bg": "bg-yellow-800", "accent_text": "text-yellow-400",   "button_bg": "bg-yellow-600", "hover_button_bg": "hover:bg-yellow-700", "accent_500": "yellow-500"},
    "amber":    {"header_bg": "bg-amber-800",  "accent_text": "text-amber-400",    "button_bg": "bg-amber-600",  "hover_button_bg": "hover:bg-amber-700",  "accent_500": "amber-500"},
    "orange":   {"header_bg": "bg-orange-800", "accent_text": "text-orange-400",   "button_bg": "bg-orange-600", "hover_button_bg": "hover:bg-orange-700", "accent_500": "orange-500"},
    "red":      {"header_bg": "bg-red-800",    "accent_text": "text-red-400",      "button_bg": "bg-red-600",    "hover_button_bg": "hover:bg-red-700",    "accent_500": "red-500"},
    "rose":     {"header_bg": "bg-rose-800",   "accent_text": "text-rose-400",     "button_bg": "bg-rose-600",   "hover_button_bg": "hover:bg-rose-700",   "accent_500": "rose-500"},
    "fuchsia":  {"header_bg": "bg-fuchsia-800","accent_text": "text-fuchsia-400",  "button_bg": "bg-fuchsia-600","hover_button_bg": "hover:bg-fuchsia-700","accent_500": "fuchsia-500"},
    "purple":   {"header_bg": "bg-purple-800", "accent_text": "text-purple-400",   "button_bg": "bg-purple-600", "hover_button_bg": "hover:bg-purple-700", "accent_500": "purple-500"},
    "slate":    {"header_bg": "bg-slate-800",  "accent_text": "text-slate-400",    "button_bg": "bg-slate-600",  "hover_button_bg": "hover:bg-slate-700",  "accent_500": "slate-500"},
    "gray":     {"header_bg": "bg-gray-800",   "accent_text": "text-gray-400",     "button_bg": "bg-gray-600",   "hover_button_bg": "hover:bg-gray-700",   "accent_500": "gray-500"},
    "neutral":  {"header_bg": "bg-neutral-800","accent_text": "text-neutral-400",  "button_bg": "bg-neutral-600","hover_button_bg": "hover:bg-neutral-700","accent_500": "neutral-500"},
}

def generate_html_header(brand_name, page_type_data, ci_classes, main_icon, brand_details):
    # Pass the brand_details directly to generate_global_js_definitions
    global_js_definitions_html = generate_global_js_definitions(brand_details).strip()

    return textwrap.dedent(f"""\
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌐 {brand_name}™ {page_type_data['title_suffix']}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {{
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }}
        ::-webkit-scrollbar {{
            width: 8px;
        }}
        ::-webkit-scrollbar-track {{
            background: #2d3748;
        }}
        ::-webkit-scrollbar-thumb {{
            background: #4a5568;
            border-radius: 4px;
        }}
        ::-webkit-scrollbar-thumb:hover {{
            background: #6b7280;
        }}
        .product-modal {{
            display: none;
            position: fixed;
            z-index: 1001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
        }}
        .product-modal-content {{
            background-color: #1a202c;
            color: #e2e8f0;
            padding: 30px;
            border: 1px solid #4a5568;
            width: 90%;
            max-width: 800px;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.25);
            animation-name: animatetop;
            animation-duration: 0.4s;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        }}
        .product-modal-close {{
            color: #cbd5e0;
            position: absolute;
            top: 15px;
            right: 25px;
            font-size: 36px;
            font-weight: bold;
        }}
        .product-modal-close:hover,
        .product-modal-close:focus {{
            color: #ffffff;
            text-decoration: none;
            cursor: pointer;
        }}
        @keyframes animatetop {{
            from {{top: -300px; opacity: 0}}
            to {{top: 0; opacity: 1}}
        }}
    </style>
    {global_js_definitions_html}
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen flex flex-col">

    <header class="{ci_classes['header_bg']} shadow-lg py-4 px-6 md:px-10 sticky top-0 z-50">
        <div class="container mx-auto flex items-start justify-between flex-wrap">
            <div class="flex items-center mb-4 md:mb-0">
                <span class="text-3xl mr-3">{main_icon}</span>
                <h1 class="text-2xl md:text-3xl font-bold {ci_classes['accent_text']}">
                    FAA.ZONE <span class="text-gray-100">Sovereign Scrolls</span>
                </h1>
            </div>

            <div class="flex flex-col items-center md:items-end w-full md:w-auto">
                <span class="text-xl md:text-2xl text-gray-400 mb-2 mt-4 md:mt-0">Global Supply Chain Grid</span>
                <nav class="w-full md:w-auto">
                    <ul class="flex flex-wrap justify-center md:justify-end space-x-2 md:space-x-4 text-sm md:text-base">
""").strip()

def generate_html_nav_links(sector_slug_for_nav, brand_slug, current_page_file, ci_classes, brand_details):
    nav_links_html = []
    # Use BASE_PUBLIC_PATH for navigation links, then concatenate.
    # This ensures links within the generated site point to the correct deployed path.
    sector_dashboard_url = os.path.join(BASE_PUBLIC_PATH, sector_slug_for_nav, "dashboard.html").replace(os.sep, '/')
    nav_links_html.append(textwrap.dedent(f"""\
                            <li><a href="{sector_dashboard_url}" class="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200">Sector Dashboard</a></li>
    """).strip()) # Apply dedent and strip
    
    # Combine standard pages and custom pages for navigation
    all_pages_for_nav = []
    for page_type_data in BRAND_PAGE_TYPES:
        all_pages_for_nav.append({
            "file": page_type_data["file"],
            "nav_label": page_type_data["nav_label"]
        })
    for custom_page in brand_details.get('custom_pages', []):
        all_pages_for_nav.append({
            "file": f"{custom_page['slug']}.html",
            "nav_label": custom_page["name"]
        })

    for page in all_pages_for_nav:
        # Construct the relative path within the brand directory for internal navigation
        internal_page_url = page['file'] # This is just e.g., "index.html", "products.html"
        active_class = f"bg-{ci_classes['accent_500']} text-white" if page["file"] == current_page_file else "hover:bg-gray-700 transition-colors duration-200"
        nav_links_html.append(textwrap.dedent(f"""\
                            <li><a href="{internal_page_url}" class="px-3 py-2 rounded-md {active_class}">{page['nav_label']}</a></li>
        """).strip()) # Apply dedent and strip
    return "".join(nav_links_html)

def generate_html_footer(ci_classes):
    return textwrap.dedent(f"""\
                        </ul>
                    </nav>
                </div>
            </div>
        </header>

        <main class="flex-grow container mx-auto px-6 py-8 md:py-12">
            <div id="dynamicContent" class="mb-12">
                {'''
                '''}
            </div>
        </main>

        <footer class="bg-gray-800 py-6 px-6 md:px-10 mt-12">
            <div class="container mx-auto text-center text-gray-400 text-sm">
                <p>&copy; 2025 FAA.ZONE Sovereign Scrolls. All rights reserved.</p>
                <p class="mt-2">
                    Part of the Global Supply Chain Grid · Powered by VaultMesh™ & TreatyMesh™ Protocols.
                </p>
                <div class="flex flex-wrap justify-center space-x-4 mt-4">
                    <a href="#" class="hover:{ci_classes['accent_text']} transition-colors duration-200">Privacy Policy</a>
                    <span class="text-gray-600">|</span>
                    <a href="#" class="hover:{ci_classes['accent_text']} transition-colors duration-200">Terms of Service</a>
                    <span class="text-gray-600">|</span>
                    <a href="#" class="hover:{ci_classes['accent_text']} transition-colors duration-200">Contact Support</a>
                </div>
            </div>
        </footer>

        <div id="productDetailModal" class="product-modal">
            <div class="product-modal-content">
                <span class="product-modal-close" onclick="hideProductModal()">&times;</span>
                <h3 id="modalProductTitle" class="text-3xl font-bold {ci_classes['accent_text']} mb-4"></h3>
                <img id="modalProductImage" src="" alt="Product Image" class="w-full h-48 object-cover rounded-md mb-4" style="display: none;">
                <p id="modalProductDescription" class="text-gray-300 mb-4 leading-relaxed"></p>
                
                <div id="modalProductFeatures" class="mb-4" style="display:none;">
                    <h4 class="text-xl font-semibold text-gray-200 mb-2">Key Features:</h4>
                    <ul class="list-disc list-inside text-gray-300 ml-4"></ul>
                </div>
                <div id="modalProductSpecs" class="mb-4" style="display:none;">
                    <h4 class="text-xl font-semibold text-gray-200 mb-2">Specifications:</h4>
                    <ul class="list-disc list-inside text-gray-300 ml-4"></ul>
                </div>
                <div id="modalProductBenefits" class="mb-4" style="display:none;">
                    <h4 class="text-xl font-semibold text-gray-200 mb-2">Benefits:</h4>
                    <ul class="list-disc list-inside text-gray-300 ml-4"></ul>
                </div>
                <div id="modalProductUseCases" class="mb-4" style="display:none;">
                    <h4 class="text-xl font-semibold text-gray-200 mb-2">Use Cases:</h4>
                    <ul class="list-disc list-inside text-gray-300 ml-4"></ul>
                </div>
                <p id="modalProductPricing" class="text-lg font-semibold text-white mt-4"></p>
                <a id="modalProductCTA" href="#" class="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md" style="display: none;">Learn More</a>
                <button onclick="hideProductModal()" class="close-modal-button mt-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md">Close</button>
            </div>
        </div>

    </body>
    </html>
""").strip()

def generate_products_html_content(brand_name, ci_classes, products_data):
    # This data is now passed directly from the brand_details.
    
    products_cards_html = []
    if products_data: # Only generate cards if products_data is not empty
        for product in products_data:
            products_cards_html.append(textwrap.dedent(f"""\
                <div data-product-id="{product['id']}" class="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700 hover:border-{ci_classes['accent_500']} transition-all duration-300 flex flex-col h-full product-card">
                    <div class="flex-grow flex flex-col justify-between">
                        <div> <span class="text-4xl mb-4 block text-center">{product.get('icon', '📦')}</span>
                            <h4 class="text-2xl font-semibold text-white mb-2 text-center">{product.get('name', 'Product')}</h4>
                            <p class="text-gray-400 text-center">{product.get('description', 'Detailed description coming soon.')}</p>
                        </div>
                    </div>
                    <button data-product-id="{product['id']}" onclick="fetchProductDetails('{product['id']}')" class="view-details-btn mt-4 {ci_classes['button_bg']} {ci_classes['hover_button_bg']} text-white font-bold py-2 px-4 rounded-md w-full">View Details</button>
                </div>
            """))

    if not products_cards_html:
        products_cards_html.append(textwrap.dedent(f"""\
            <div class="col-span-full text-center py-8">
                <p class="text-gray-400 text-xl">No products defined for {brand_name} yet. Check back soon!</p>
            </div>
        """))

    products_html = textwrap.dedent(f"""\
    <section class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-extrabold text-white mb-4">
            📦 {brand_name}™ Solutions & Modules
        </h2>
        <p class="text-lg md::text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our advanced modules for intelligent network design, real-time optimization, and predictive resilience across your global delivery operations.
        </p>
    </section>

    <section class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Core Network Optimization Modules</h3>
        <div id="productGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {"".join(products_cards_html)}
        </div>
    </section>

    <section id="featuresDeepDiveSection" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Features Deep Dive</h3>
        <div id="featuresDeepDiveContent" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <p class="text-gray-400 text-center col-span-full">Loading features...</p>
        </div>
    </section>

    <section id="integrationCapabilitiesSection" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Integration Capabilities</h3>
        <div id="integrationCapabilitiesContent" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <p class="text-gray-400 text-center col-span-full">Loading integrations...</p>
        </div>
    </section>
    
    <section id="useCasesSection" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Key Use Cases</h3>
        <div id="useCasesContent" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <p class="text-gray-400 text-center col-span-full">Loading use cases...</p>
        </div>
    </section>

    <section id="techSpecsSection" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Technical Specifications</h3>
        <div id="techSpecsContent">
            <p class="text-gray-400 text-center">Loading technical specifications...</p>
        </div>
    </section>

    <section id="securityComplianceSection" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Security & Compliance Highlights</h3>
        <div id="securityComplianceContent">
            <p class="text-gray-400 text-center">Loading security and compliance information...</p>
        </div>
    </section>

    <section id="customerSuccessSection" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Customer Success Stories</h3>
        <div id="customerSuccessContent">
            <p class="text-gray-400 text-center">Loading customer stories...</p>
        </div>
    </section>

    <section id="supportTrainingSection" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Support & Training</h3>
        <div id="supportTrainingContent">
            <p class="text-gray-400 text-center">Loading support and training info...</p>
        </div>
    </section>

    <section id="faqSection" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Frequently Asked Questions</h3>
        <div id="faqContent">
            <p class="text-gray-400 text-center">Loading FAQs...</p>
        </div>
    </section>

    <section id="pricingOverviewSection" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Pricing Overview</h3>
        <div id="pricingOverviewContent">
            <p class="text-gray-400 text-center">Loading pricing overview...</p>
        </div>
    </section>
    """).strip()
    return products_html

# Simplified generate_js_for_page now that global functions are handled by generate_global_js_definitions
# UPDATED: Changed how page_file is accessed from page_type_data to the new page_info structure.
def generate_js_for_page(sector_slug, brand_info, page_info_for_js, sector_details): # Renamed `page_type_data` to `page_info_for_js` for clarity
    page_file = page_info_for_js["file"] # Now correctly accesses 'file' from the top-level page_info_for_js
    page_slug = page_info_for_js["slug"] # Also use slug from page_info_for_js
    brand_name = brand_info["name"]
    brand_slug_clean = brand_info["name"].lower().replace(' ', '-').replace('™', '')
    
    ci_classes = CI_COLOR_MAP.get(sector_details.get("ci_color", "gray"), CI_COLOR_MAP["gray"])
    
    sector_slug_for_js = sector_slug.replace('-', '_') 

    js_content = textwrap.dedent(f"""\
<script>
    document.addEventListener('DOMContentLoaded', () => {{
        const brandName = "{brand_name}";
        const sectorSlug = "{sector_slug_for_js}";
        const pageType = "{page_slug}"; // Use page_slug for pageType
        const accentColor500 = "{ci_classes['accent_500']}";
        const buttonBgClass = "{ci_classes['button_bg']}";
        const hoverButtonBgClass = "{ci_classes['hover_button_bg']}";

        console.log(`Loaded ${{brandName}} ${{pageType}} page.`);

        // Access global data populated by generate_global_js_definitions
        const featuresDeepDiveData = window.featuresDeepDiveData;
        const integrationCapabilitiesData = window.integrationCapabilitiesData;
        const useCasesData = window.useCasesData;
        const techSpecsData = window.techSpecsData;
        const securityComplianceData = window.securityComplianceData;
        const customerSuccessStories = window.customerSuccessStories;
        const supportTrainingData = window.supportTrainingData;
        const faqData = window.faqData;
        const pricingOverviewContent = window.pricingOverviewContent;


        if (pageType === "products") {{
            // This fetch can be used if you want to update them dynamically from a backend.
            // For now, product cards are initially rendered by Python, and modal data is global.
            // If you want to replace them completely with a backend fetch, enable this:
            /*
            fetch(`http://localhost:5000/api/sectors/$${{sectorSlug}}/brands/$${{brand_slug_clean}}/products`)
                .then(response => {{
                    if (!response.ok) {{
                        if (response.status === 404) {{
                            console.warn('Products data not found from backend, using initial HTML render and global mock data for modals.');
                            return {{ products: [], error: 'Backend endpoint not found for products, using embedded data.' }};
                        }}
                        throw new Error(`Network response was not ok: $${{response.status}} $${{response.statusText}}`);
                    }}
                    return response.json();
                }})
                .then(data => {{
                    // This is where you would render the product cards if fetching dynamically.
                    // For now, productGrid is populated by Python initially.
                    console.log("Fetched dynamic products (if applicable):", data);
                }})
                .catch(error => {{
                    console.error('Error fetching product listings from backend:', error);
                }});
            */

            // Render other sections using global data (now brand-specific via generate_global_js_definitions)
            const renderGridSection = (elementId, data, itemHtmlCallback) => {{
                const container = document.getElementById(elementId);
                if (container && data && data.length > 0) {{
                    container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">${{data.map(itemHtmlCallback).join('')}}</div>`;
                }} else if (container) {{
                    container.innerHTML = `<p class="text-gray-400 text-center col-span-full">No data available for this section.</p>`;
                }}
            }};

            renderGridSection('featuresDeepDiveContent', featuresDeepDiveData, f => `
                <div class="bg-gray-900 rounded-lg shadow-md p-5 border border-gray-700">
                    <span class="text-3xl block mb-2">$${{f.icon}}</span>
                    <h4 class="text-xl font-semibold text-white mb-2">$${{f.title}}</h4>
                    <p class="text-gray-400">$${{f.description}}</p>
                </div>
            `);

            renderGridSection('integrationCapabilitiesContent', integrationCapabilitiesData, i => `
                <div class="bg-gray-900 rounded-lg shadow-md p-5 border border-gray-700">
                    <span class="text-3xl block mb-2">$${{i.icon}}</span>
                    <h4 class="text-xl font-semibold text-white mb-2">$${{i.name}}</h4>
                    <p class="text-gray-400">$${{i.description}}</p>
                </div>
            `);

            renderGridSection('useCasesContent', useCasesData, uc => `
                <div class="bg-gray-900 rounded-lg shadow-md p-5 border border-gray-700">
                    <span class="text-3xl block mb-2">$${{uc.icon}}</span>
                    <h4 class="text-xl font-semibold text-white mb-2">$${{uc.title}}</h4>
                    <p class="text-gray-400">$${{uc.description}}</p>
                </div>
            `);
            
            const techSpecsDiv = document.getElementById('techSpecsContent');
            if (techSpecsDiv && Object.keys(techSpecsData).length > 0) {{
                const techSpecsList = document.createElement('ul');
                techSpecsList.className = 'list-disc list-inside text-gray-300 ml-4';
                for (const spec in techSpecsData) {{
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>$${{spec}}</strong>: $${{techSpecsData[spec]}}`;
                    techSpecsList.appendChild(li);
                }}
                techSpecsDiv.innerHTML = '';
                techSpecsDiv.appendChild(techSpecsList);
            }} else if (techSpecsDiv) {{ techSpecsDiv.innerHTML = `<p class="text-gray-400 text-center">No technical specifications available.</p>`; }}

            const securityComplianceDiv = document.getElementById('securityComplianceContent');
            if (securityComplianceDiv && securityComplianceData.length > 0) {{
                const securityList = document.createElement('ul');
                securityList.className = 'list-disc list-inside text-gray-300 ml-4';
                securityComplianceData.forEach(highlight => {{
                    const li = document.createElement('li');
                    li.textContent = highlight;
                    securityList.appendChild(li);
                }});
                securityComplianceDiv.innerHTML = '';
                securityComplianceDiv.appendChild(securityList);
            }} else if (securityComplianceDiv) {{ securityComplianceDiv.innerHTML = `<p class="text-gray-400 text-center">No security and compliance highlights available.</p>`; }}

            const customerSuccessDiv = document.getElementById('customerSuccessContent');
            if (customerSuccessDiv && customerSuccessStories.length > 0) {{
                customerSuccessDiv.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        $${{customerSuccessStories.map(story => `
                            <div class="bg-gray-900 rounded-lg shadow-md p-5 border border-gray-700">
                                <p class="text-gray-300 italic mb-3">"$${{story.quote}}"</p>
                                <p class="text-white font-semibold">- $${{story.name}}, <span class="text-gray-400">$${{story.industry}}</span></p>
                            </div>
                        `).join('')}}
                    </div>
                `;
            }} else if (customerSuccessDiv) {{ customerSuccessDiv.innerHTML = `<p class="text-gray-400 text-center">No customer success stories available.</p>`; }}

            const supportTrainingDiv = document.getElementById('supportTrainingContent');
            if (supportTrainingDiv && supportTrainingData.length > 0) {{
                supportTrainingDiv.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        $${{supportTrainingData.map(item => `
                            <div class="bg-gray-900 rounded-lg shadow-md p-5 border border-gray-700">
                                <span class="text-3xl block mb-2">$${{item.icon}}</span>
                                <h4 class="text-xl font-semibold text-white mb-2">$${{item.title}}</h4>
                                <p class="text-gray-400">$${{item.description}}</p>
                            </div>
                        `).join('')}}
                    </div>
                `;
            }} else if (supportTrainingDiv) {{ supportTrainingDiv.innerHTML = `<p class="text-gray-400 text-center">No support and training information available.</p>`; }}

            const faqDiv = document.getElementById('faqContent');
            if (faqDiv && faqData.length > 0) {{
                faqDiv.innerHTML = faqData.map(faq => `
                    <div class="bg-gray-900 rounded-lg shadow-md p-5 mb-4 border border-gray-700">
                        <h4 class="text-xl font-semibold text-white mb-2">$${{faq.question}}</h4>
                        <p class="text-gray-400">$${{faq.answer}}</p>
                    </div>
                `).join('');
            }} else if (faqDiv) {{ faqDiv.innerHTML = `<p class="text-gray-400 text-center">No FAQs available.</p>`; }}

            const pricingOverviewDiv = document.getElementById('pricingOverviewContent');
            if (pricingOverviewDiv && pricingOverviewContent) {{
                pricingOverviewDiv.innerHTML = pricingOverviewContent;
            }} else if (pricingOverviewDiv) {{ pricingOverviewDiv.innerHTML = `<p class="text-gray-400 text-center">No pricing overview available.</p>`; }}

        }} // End if pageType === "products"
    }}); // End DOMContentLoaded
</script>
""").strip()
    return js_content

def generate_main_page_content(page_slug, brand_details, page_type_data, ci_classes):
    brand_name = brand_details["name"]
    # Check if it's a standard page type first
    for standard_page in BRAND_PAGE_TYPES:
        if standard_page["file"].replace('.html', '') == page_slug:
            page_title = standard_page['title_suffix']
            hero_icon = standard_page['hero_icon']

            if page_slug == "products":
                # Special handling for products page - call its dedicated content generator
                return generate_products_html_content(brand_name, ci_classes, brand_details.get('products_data', []))
            
            # Default content for other standard pages
            return textwrap.dedent(f"""\
<section class="text-center mb-12">
    <h2 class="text-5xl md:text-6xl font-extrabold text-white mb-4">
        {hero_icon} {brand_name}™ {page_title}
    </h2>
    <p class="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
        This is the {page_title} page for {brand_name}. Content for this page will be dynamically loaded or expanded here.
    </p>
    <div class="mt-8">
        <a href="dashboard.html" class="{ci_classes['button_bg']} {ci_classes['hover_button_bg']} text-white font-bold py-3 px-8 rounded-md transition-colors duration-200 shadow-lg">
            Go to Dashboard
        </a>
    </div>
</section>
<section class="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
    <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-4">Welcome to our {page_title}</h3>
    <p class="text-gray-300 leading-relaxed">
        Detailed information and interactive elements for {brand_name}'s {page_title.lower()} will be available here.
        We are continuously updating our portal to provide the most relevant data and user experience.
    </p>
    <div class="mt-6 text-gray-400">
        <p><strong>Key Areas:</strong></p>
        <ul class="list-disc list-inside ml-4 mt-2">
            <li>Overview of {brand_name} offerings.</li>
            <li>In-depth insights into {page_title.lower()} data.</li>
            <li>Relevant statistics and user-specific information.</li>
        </ul>
    </div>
</section>
""")
    
    # If not a standard page, check if it's a custom page
    for custom_page_info in brand_details.get('custom_pages', []):
        if custom_page_info["slug"] == page_slug:
            content = custom_page_info.get('content', {})
            # Generate unique content based on the 'content' dictionary
            # You can make this as complex as needed to inject specific HTML structure
            # For now, a generic rendering of common content types:
            paragraphs_html = "".join([f"<p class=\"text-gray-300 leading-relaxed mb-4\">{p}</p>" for p in content.get('paragraphs', [])])
            key_benefits_html = ""
            if content.get('key_benefits'):
                key_benefits_html = "<h4 class=\"text-xl font-semibold text-white mb-2 mt-4\">Key Benefits:</h4><ul class=\"list-disc list-inside text-gray-300 ml-4 mt-2 mb-4\">" + "".join([f"<li>{b}</li>" for b in content['key_benefits']]) + "</ul>"
            
            image_html = ""
            if content.get('image'):
                image_html = f"<img src=\"{content['image']}\" alt=\"{custom_page_info['name']}\" class=\"mx-auto my-6 rounded-lg shadow-lg max-w-full h-auto\" style=\"max-width: 700px;\">"

            steps_html = ""
            if content.get('steps'):
                steps_list = []
                for i, step in enumerate(content['steps']):
                    steps_list.append(f"""
                    <div class="bg-gray-900 rounded-lg shadow-md p-5 border border-gray-700">
                        <h4 class="text-xl font-semibold {ci_classes['accent_text']} mb-2">Step {i+1}: {step.get('title', '')}</h4>
                        <p class="text-gray-400">{step.get('description', '')}</p>
                    </div>
                    """)
                steps_html = "<div class=\"grid grid-cols-1 md:grid-cols-2 gap-6 mt-6\">" + "".join(steps_list) + "</div>"


            return textwrap.dedent(f"""\
<section class="text-center mb-12">
    <h2 class="text-5xl md:text-6xl font-extrabold text-white mb-4">
        {custom_page_info.get('hero_icon', '✨')} {brand_name}™ {custom_page_info.get('title_suffix', custom_page_info['name'])}
    </h2>
    <p class="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
        {content.get('heading', f'Detailed information about {custom_page_info["name"]}.')}
    </p>
</section>
<section class="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
    {image_html}
    {paragraphs_html}
    {key_benefits_html}
    {steps_html}
    <div class="mt-8 text-center">
        <a href="contact.html" class="{ci_classes['button_bg']} {ci_classes['hover_button_bg']} text-white font-bold py-3 px-8 rounded-md transition-colors duration-200 shadow-lg">
            Get in touch for details
        </a>
    </div>
</section>
""")
    
    # Fallback if page not found
    return f"<p class=\"text-red-400 text-center\">Content for {page_slug} is not defined for {brand_name}.</p>"


# --- Main Generation Logic ---
def generate_brand_portal_pages():
    # Clean previous generated_pages to ensure consistency with new run
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
        print(f"Cleaned existing {OUTPUT_DIR} directory.")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("Starting page generation...")

    total_pages_generated = 0
    for sector_slug, sector_info in SECTOR_DATA_FOR_GENERATION.items():
        sector_dir = os.path.join(OUTPUT_DIR, sector_slug)
        os.makedirs(sector_dir, exist_ok=True)

        ci_classes = CI_COLOR_MAP.get(sector_info.get("ci_color", "gray"), CI_COLOR_MAP["gray"])
        
        # Determine if sector has brands
        has_brands = bool(sector_info.get("brands"))

        if has_brands:
            for brand_details in sector_info["brands"]: # Renamed to brand_details for clarity
                brand_name = brand_details["name"]
                brand_slug = brand_name.lower().replace(' ', '-').replace('™', '')
                brand_icon = brand_details["brand_icon"]

                brand_output_dir = os.path.join(sector_dir, brand_slug)
                os.makedirs(brand_output_dir, exist_ok=True)

                # Combine standard pages and custom pages for this brand for iteration
                all_pages_to_generate = []
                for page_type_data in BRAND_PAGE_TYPES:
                    all_pages_to_generate.append({
                        "file": page_type_data["file"],
                        "name": page_type_data["nav_label"],
                        "slug": page_type_data["file"].replace('.html', ''),
                        "is_custom": False, # Mark as standard
                        "page_type_data": page_type_data # Store original data for headers etc.
                    })
                
                for custom_page in brand_details.get('custom_pages', []):
                    all_pages_to_generate.append({
                        "file": f"{custom_page['slug']}.html", # Custom pages use their slug as filename
                        "name": custom_page["name"],
                        "slug": custom_page["slug"],
                        "is_custom": True, # Mark as custom
                        "page_type_data": { # Create a similar structure for custom pages for header
                            "title_suffix": custom_page.get('title_suffix', custom_page['name']),
                            "hero_icon": custom_page.get('hero_icon', '✨')
                        }
                    })

                for page_info in all_pages_to_generate:
                    file_name = page_info["file"]
                    page_slug = page_info["slug"]
                    page_type_data = page_info["page_type_data"] # Use the determined page_type_data

                    output_file_path = os.path.join(brand_output_dir, file_name)
                    
                    # Construct the deployable URL for GitHub Pages/Vercel
                    deployable_url = os.path.join(BASE_PUBLIC_PATH, sector_slug, brand_slug, file_name).replace(os.sep, '/')

                    # Pass brand_details to generate_html_header so it can access all content
                    header_html = generate_html_header(brand_name, page_type_data, ci_classes, brand_icon, brand_details)
                    # Pass brand_details to generate_html_nav_links for custom pages in nav
                    nav_links_html = generate_html_nav_links(sector_slug, brand_slug, file_name, ci_classes, brand_details)
                    footer_html = generate_html_footer(ci_classes)

                    # Determine main content based on page slug and brand_details
                    main_content = generate_main_page_content(page_slug, brand_details, page_type_data, ci_classes)
                    page_js = generate_js_for_page(sector_slug, brand_details, page_info, sector_info) # Pass page_info directly

                    html_lines = [
                        "<!DOCTYPE html>",
                        "<html lang=\"en\">",
                        header_html,
                        nav_links_html,
                        "                        </ul>",
                        "                    </nav>",
                        "                </div>",
                        "            </div>",
                        "        </header>",
                        "", # Blank line for readability
                        "        <main class=\"flex-grow container mx-auto px-6 py-8 md:py-12\">",
                        "            ",
                        "            <div id=\"dynamicContent\" class=\"mb-12\">",
                        "\n".join("    " + line for line in main_content.splitlines()),
                        "            </div>",
                        "        </main>",
                        footer_html,
                        page_js, # Inject page-specific JS here
                        "</html>"
                    ]

                    full_html_content = "\n".join(html_lines)

                    with open(output_file_path, "w", encoding="utf-8") as f:
                        f.write(full_html_content)
                    print(f"Generated: {output_file_path} (Deployable URL: {deployable_url})")
                    total_pages_generated += 1
        else:
            # If a sector has no brands, generate a default index page (Sector Overview)
            file_name = "index.html"
            output_file_path = os.path.join(sector_dir, file_name)
            
            deployable_url = os.path.join(BASE_PUBLIC_PATH, sector_slug, file_name).replace(os.sep, '/')

            dummy_brand_name = sector_slug.replace('-', ' ').title() + " Sector Overview"
            dummy_page_type_data = {"file": "index.html", "title_suffix": "Sector Overview", "nav_label": "Overview", "hero_icon": sector_info.get("sector_icon", "📁")}
            # Dummy brand_details for sector overview page to satisfy generate_html_header signature
            dummy_brand_details = {
                "name": dummy_brand_name,
                "brand_icon": dummy_page_type_data['hero_icon'],
                "products_data": [],
                "features_deep_dive": [], "integration_capabilities": [], "use_cases_data": [],
                "tech_specs_data": {}, "security_compliance_data": [], "customer_success_stories": [],
                "support_training_data": [], "faq_data": [], "pricing_overview_content": "",
                "custom_pages": []
            }


            header_html = generate_html_header(dummy_brand_name, dummy_page_type_data, ci_classes, dummy_page_type_data['hero_icon'], dummy_brand_details)
            # The sector overview page has a simplified navigation
            nav_links_html = textwrap.dedent(f"""\
                            <li><a href="{ADMIN_PORTAL_ABSOLUTE_PATH}" class="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200">Admin Portal</a></li>
            """).strip()
            footer_html = generate_html_footer(ci_classes)

            main_content = textwrap.dedent(f"""\
<section class="text-center mb-12">
    <h2 class="text-5xl md:text-6xl font-extrabold text-white mb-4">
        {dummy_page_type_data['hero_icon']} {dummy_brand_name}
    </h2>
    <p class="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
        This is the overview page for the {dummy_brand_name}. No specific brands have been defined yet.
    </p>
    <div class="mt-8">
        <a href="{ADMIN_PORTAL_ABSOLUTE_PATH}" class="{ci_classes['button_bg']} {ci_classes['hover_button_bg']} text-white font-bold py-3 px-8 rounded-md transition-colors duration-200 shadow-lg">
            Go to Admin Panel to Add Brands
        </a>
    </div>
</section>
<section class="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
    <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-4">Sector Information</h3>
    <p class="text-gray-300 leading-relaxed">
        This sector covers areas related to {sector_slug.replace('-', ' ').title()}. More details will appear here once brands are added.
    </p>
</section>
""")
            
            html_lines = [
                "<!DOCTYPE html>",
                "<html lang=\"en\">",
                header_html,
                nav_links_html,
                "                        </ul>",
                "                    </nav>",
                "                </div>",
                "            </div>",
                "        </header>",
                "",
                "        <main class=\"flex-grow container mx-auto px-6 py-8 md:py-12\">",
                "            ",
                "            <div id=\"dynamicContent\" class=\"mb-12\">",
                "\n".join("    " + line for line in main_content.splitlines()),
                "            </div>",
                "        </main>",
                footer_html,
                "</html>"
            ]
            
            full_html_content = "\n".join(html_lines)

            with open(output_file_path, "w", encoding="utf-8") as f:
                f.write(full_html_content)
            print(f"Generated (Sector Overview): {output_file_path} (Deployable URL: {deployable_url})")
            total_pages_generated += 1
    print(f"\nPage generation complete. Total pages generated: {total_pages_generated}")


# Run the generation
if __name__ == "__main__":
    generate_brand_portal_pages()
