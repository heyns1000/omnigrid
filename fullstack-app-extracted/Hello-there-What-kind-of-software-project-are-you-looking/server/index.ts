import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// CRITICAL: Load YOUR authentic templates FIRST before any other middleware
import { directServer } from "./direct-serve";
import { getEnhancedDashboard } from "./enhanced-dashboard";
import { getEnhancedVaultMesh } from "./enhanced-vaultmesh";

// ABSOLUTE PRIORITY - Override ALL middleware for main routes
// PRIORITY: Serve YOUR VaultMesh Banimal Loop Checkout as main business system
// Serve YOUR authentic VaultMesh Banimal Loop Checkout at dedicated route
app.get("/vaultmesh-checkout", (req, res) => {
  try {
    console.log("🎯 SERVING YOUR AUTHENTIC VAULTMESH BANIMAL LOOP CHECKOUT");
    const vaultmesh = directServer.getVaultMeshCheckout();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.end(vaultmesh);
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).end("Error: " + error.message);
  }
});

// Admin interface on /admin route
app.get("/admin", (req, res, next) => {
  next(); // Let Vite handle this
});

// Serve authentic dashboard only on /sector-dashboard route
app.get("/sector-dashboard", (req, res) => {
  try {
    console.log("🎯 SERVING YOUR AUTHENTIC SECTOR INDEX DASHBOARD");
    const dashboard = directServer.getSectorIndexDashboard();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.end(dashboard);
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).end("Error: " + error.message);
  }
});

app.get("/dashboard", (req, res) => {
  try {
    console.log("🎯 SERVING YOUR AUTHENTIC SECTOR INDEX DASHBOARD");
    const dashboard = directServer.getSectorIndexDashboard();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(dashboard);
  } catch (error) {
    console.error("❌ CRITICAL ERROR:", error);
    res.status(500).send("Error: " + error.message);
  }
});

app.get("/vaultmesh", (req, res) => {
  try {
    console.log("🎯 SERVING YOUR AUTHENTIC VAULTMESH CHECKOUT");
    const checkout = directServer.getVaultMeshCheckout();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(checkout);
  } catch (error) {
    console.error("❌ CRITICAL ERROR:", error);
    res.status(500).send("Error: " + error.message);
  }
});

// Admin route for template management system we built all day
app.get("/admin", (req, res, next) => {
  console.log("🎯 ACCESSING TEMPLATE MANAGEMENT SYSTEM");
  next(); // Let Vite handle this for the React admin interface
});

app.get("/admin/*", (req, res, next) => {
  console.log("🎯 ACCESSING ADMIN SECTION:", req.path);
  next(); // Let Vite handle admin routes
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Seed database with initial data
  try {
    const { seedDatabase } = await import("./seed-data");
    await seedDatabase();
    console.log("✅ Database seeding completed");
  } catch (error) {
    console.log("⚠️ Database seeding skipped:", error.message);
  }

  // Register routes FIRST - NO Vite interference with YOUR authentic templates
  const server = await registerRoutes(app);

  // Only setup Vite for admin routes - NOT for main dashboard
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
