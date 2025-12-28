import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pythonEngine, type DeploymentConfig } from "./python-engine";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { getAuthenticSectorIndexDashboard, getAuthenticVaultMeshCheckout } from "./direct-dashboard";
import { insertBrandSchema, insertSectorSchema, insertTemplateSchema, insertBrandSectorMappingSchema, insertTemplateDeploymentSchema, insertAnalyticsSchema, insertSecureSignDocumentSchema, insertFaaPlaceholderShellSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // HIGHEST PRIORITY: Block ALL other routes and serve ONLY YOUR authentic templates
  
  // Serve authentic templates on specific routes only

  // Dashboard route - YOUR authentic template  
  app.get("/dashboard", async (req, res) => {
    try {
      console.log("🎯 SERVING YOUR AUTHENTIC DASHBOARD");
      const authenticDashboard = getAuthenticSectorIndexDashboard();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.end(authenticDashboard);
    } catch (error) {
      console.error("❌ CRITICAL ERROR:", error);
      res.status(500).end("Error: " + error.message);
    }
  });

  // PayPal routes
  app.get("/api/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/api/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  app.get("/dashboard", async (req, res) => {
    try {
      // Serve YOUR authentic dashboard directly
      const authenticDashboard = getAuthenticSectorIndexDashboard();
      res.setHeader('Content-Type', 'text/html');
      res.send(authenticDashboard);
      return;
    } catch (error) {
      console.error("Error loading YOUR authentic dashboard:", error);
      res.status(500).send("Error loading YOUR authentic dashboard: " + error.message);
      return;
    }
  });

  // VaultMesh route to serve YOUR authentic Banimal Loop Checkout
  app.get("/vaultmesh", async (req, res) => {
    try {
      // Serve YOUR authentic VaultMesh directly
      const authenticVaultMesh = getAuthenticVaultMeshCheckout();
      res.setHeader('Content-Type', 'text/html');
      res.send(authenticVaultMesh);
      return;
    } catch (error) {
      console.error("Error loading YOUR authentic VaultMesh:", error);
      res.status(500).send("Error loading YOUR authentic VaultMesh: " + error.message);
      return;
    }
  });

  // Brand management routes
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getAllBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });

  app.post("/api/brands", async (req, res) => {
    try {
      const validatedData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(validatedData);
      res.status(201).json(brand);
    } catch (error) {
      res.status(400).json({ error: "Invalid brand data" });
    }
  });

  app.get("/api/brands/:id", async (req, res) => {
    try {
      const brand = await storage.getBrand(req.params.id);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brand" });
    }
  });

  app.put("/api/brands/:id", async (req, res) => {
    try {
      const validatedData = insertBrandSchema.parse(req.body);
      const brand = await storage.updateBrand(req.params.id, validatedData);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      res.status(400).json({ error: "Invalid brand data" });
    }
  });

  app.delete("/api/brands/:id", async (req, res) => {
    try {
      const success = await storage.deleteBrand(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Brand not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete brand" });
    }
  });

  // Python Deployment Engine Routes
  app.post("/api/python/initialize", async (req, res) => {
    try {
      const { pythonCode } = req.body;
      if (!pythonCode) {
        return res.status(400).json({ error: "Python code is required" });
      }
      
      await pythonEngine.initializePythonScript(pythonCode);
      res.json({ success: true, message: "Python deployment script initialized" });
    } catch (error) {
      res.status(500).json({ error: "Failed to initialize Python script" });
    }
  });

  app.post("/api/python/deploy", async (req, res) => {
    try {
      const deploymentConfig: DeploymentConfig = req.body;
      
      if (!deploymentConfig.sectorName || !deploymentConfig.brandName) {
        return res.status(400).json({ error: "Sector name and brand name are required" });
      }

      const result = await pythonEngine.executeDeployment(deploymentConfig);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to execute deployment" });
    }
  });

  app.get("/api/python/deployment/:deploymentId", async (req, res) => {
    try {
      const { deploymentId } = req.params;
      const status = await pythonEngine.getDeploymentStatus(deploymentId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to get deployment status" });
    }
  });

  app.get("/api/python/deployment/:deploymentId/file/:fileName", async (req, res) => {
    try {
      const { deploymentId, fileName } = req.params;
      const content = await pythonEngine.getGeneratedFileContent(deploymentId, fileName);
      
      if (!content) {
        return res.status(404).json({ error: "File not found" });
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to get file content" });
    }
  });

  // Sector management routes
  app.get("/api/sectors", async (req, res) => {
    try {
      const sectors = await storage.getAllSectors();
      res.json(sectors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sectors" });
    }
  });

  app.post("/api/sectors", async (req, res) => {
    try {
      const validatedData = insertSectorSchema.parse(req.body);
      const sector = await storage.createSector(validatedData);
      res.status(201).json(sector);
    } catch (error) {
      res.status(400).json({ error: "Invalid sector data" });
    }
  });

  // Template management routes
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ error: "Invalid template data" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // Brand-Sector mapping routes
  app.get("/api/brand-sector-mappings", async (req, res) => {
    try {
      const mappings = await storage.getAllBrandSectorMappings();
      res.json(mappings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mappings" });
    }
  });

  app.post("/api/brand-sector-mappings", async (req, res) => {
    try {
      const validatedData = insertBrandSectorMappingSchema.parse(req.body);
      const mapping = await storage.createBrandSectorMapping(validatedData);
      res.status(201).json(mapping);
    } catch (error) {
      res.status(400).json({ error: "Invalid mapping data" });
    }
  });

  // Template deployment routes
  app.get("/api/deployments", async (req, res) => {
    try {
      const deployments = await storage.getAllDeployments();
      res.json(deployments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deployments" });
    }
  });

  app.post("/api/deployments", async (req, res) => {
    try {
      const validatedData = insertTemplateDeploymentSchema.parse(req.body);
      const deployment = await storage.createDeployment(validatedData);
      res.status(201).json(deployment);
    } catch (error) {
      res.status(400).json({ error: "Invalid deployment data" });
    }
  });

  app.post("/api/deployments/deploy", async (req, res) => {
    try {
      const { templateId, brandId, sectorId } = req.body;
      const deployment = await storage.deployTemplate(templateId, brandId, sectorId);
      res.json(deployment);
    } catch (error) {
      res.status(500).json({ error: "Failed to deploy template" });
    }
  });

  // Analytics routes
  app.get("/api/analytics", async (req, res) => {
    try {
      const { brandId, sectorId } = req.query;
      const analytics = await storage.getAnalytics(
        brandId as string,
        sectorId as string
      );
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.post("/api/analytics", async (req, res) => {
    try {
      const validatedData = insertAnalyticsSchema.parse(req.body);
      const analytics = await storage.createAnalytics(validatedData);
      res.status(201).json(analytics);
    } catch (error) {
      res.status(400).json({ error: "Invalid analytics data" });
    }
  });

  // Advanced Analytics Routes
  app.get("/api/analytics/advanced", async (req, res) => {
    try {
      const advancedAnalytics = await storage.generateAdvancedAnalytics();
      res.json(advancedAnalytics);
    } catch (error) {
      console.error("Advanced analytics error:", error);
      res.status(500).json({ error: "Failed to generate advanced analytics" });
    }
  });

  app.get("/api/analytics/brand-performance", async (req, res) => {
    try {
      const { brandId } = req.query as { brandId?: string };
      const performance = await storage.getBrandPerformance(brandId);
      res.json(performance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brand performance" });
    }
  });

  app.get("/api/analytics/sector-insights", async (req, res) => {
    try {
      const { sectorId } = req.query as { sectorId?: string };
      const insights = await storage.getSectorInsights(sectorId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sector insights" });
    }
  });

  app.get("/api/analytics/cross-brand", async (req, res) => {
    try {
      const { metric } = req.query as { metric?: string };
      const crossBrand = await storage.getCrossBrandAnalytics(metric);
      res.json(crossBrand);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cross-brand analytics" });
    }
  });

  app.get("/api/analytics/consolidated", async (req, res) => {
    try {
      const { dateRange, period } = req.query as { dateRange?: string; period?: string };
      const consolidated = await storage.getConsolidatedAnalytics(dateRange, period);
      res.json(consolidated);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch consolidated analytics" });
    }
  });

  // SecureSign™ routes - Core product for every brand/subnode  
  app.get("/api/securesign/documents", async (req, res) => {
    try {
      const documents = await storage.getAllSecureSignDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch SecureSign documents" });
    }
  });

  app.post("/api/securesign/documents", async (req, res) => {
    try {
      const validatedData = insertSecureSignDocumentSchema.parse(req.body);
      const document = await storage.createSecureSignDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ error: "Invalid SecureSign document data" });
    }
  });

  app.get("/api/securesign/documents/:id", async (req, res) => {
    try {
      const document = await storage.getSecureSignDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ error: "SecureSign document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch SecureSign document" });
    }
  });

  app.put("/api/securesign/documents/:id", async (req, res) => {
    try {
      const validatedData = insertSecureSignDocumentSchema.partial().parse(req.body);
      const document = await storage.updateSecureSignDocument(req.params.id, validatedData);
      res.json(document);
    } catch (error) {
      res.status(400).json({ error: "Invalid SecureSign document update data" });
    }
  });

  // FAA™ Placeholder Intake Shell routes
  app.get("/api/faa-shells", async (req, res) => {
    try {
      const shells = await storage.getAllFaaPlaceholderShells();
      res.json(shells);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch FAA Placeholder Shells" });
    }
  });

  app.post("/api/faa-shells", async (req, res) => {
    try {
      const validatedData = insertFaaPlaceholderShellSchema.parse(req.body);
      const shell = await storage.createFaaPlaceholderShell(validatedData);
      res.status(201).json(shell);
    } catch (error) {
      res.status(400).json({ error: "Invalid FAA Placeholder Shell data" });
    }
  });

  app.get("/api/faa-shells/spine/:spineId", async (req, res) => {
    try {
      const shell = await storage.getFaaPlaceholderShellBySpineId(req.params.spineId);
      if (!shell) {
        return res.status(404).json({ error: "FAA Placeholder Shell not found" });
      }
      res.json(shell);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch FAA Placeholder Shell" });
    }
  });

  app.get("/api/faa-shells/:id", async (req, res) => {
    try {
      const shell = await storage.getFaaPlaceholderShell(req.params.id);
      if (!shell) {
        return res.status(404).json({ error: "FAA Placeholder Shell not found" });
      }
      res.json(shell);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch FAA Placeholder Shell" });
    }
  });

  app.put("/api/faa-shells/:id", async (req, res) => {
    try {
      const validatedData = insertFaaPlaceholderShellSchema.partial().parse(req.body);
      const shell = await storage.updateFaaPlaceholderShell(req.params.id, validatedData);
      res.json(shell);
    } catch (error) {
      res.status(400).json({ error: "Invalid FAA Placeholder Shell update data" });
    }
  });

  app.post("/api/faa-shells/:id/activate-apendance", async (req, res) => {
    try {
      const { sectorId, brandId } = req.body;
      if (!sectorId || !brandId) {
        return res.status(400).json({ error: "sectorId and brandId are required" });
      }
      const shell = await storage.activateSectorApendance(req.params.id, sectorId, brandId);
      res.json(shell);
    } catch (error) {
      res.status(400).json({ error: "Failed to activate Sector Apendance" });
    }
  });

  app.delete("/api/faa-shells/:id", async (req, res) => {
    try {
      await storage.deleteFaaPlaceholderShell(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete FAA Placeholder Shell" });
    }
  });

  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
