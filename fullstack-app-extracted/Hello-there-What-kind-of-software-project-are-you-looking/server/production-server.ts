import express from "express";
import { createServer } from "http";
import { directServer } from "./direct-serve";

const app = express();

// ONLY serve YOUR authentic templates - NO React interference
app.get("/", (req, res) => {
  try {
    console.log("🎯 PRODUCTION: SERVING YOUR AUTHENTIC SECTOR INDEX DASHBOARD");
    const dashboard = directServer.getSectorIndexDashboard();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(dashboard);
  } catch (error) {
    console.error("❌ CRITICAL ERROR:", error);
    res.status(500).end("Error loading dashboard: " + (error instanceof Error ? error.message : String(error)));
  }
});

app.get("/dashboard", (req, res) => {
  try {
    console.log("🎯 PRODUCTION: SERVING YOUR AUTHENTIC DASHBOARD");
    const dashboard = directServer.getSectorIndexDashboard();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.end(dashboard);
  } catch (error) {
    console.error("❌ CRITICAL ERROR:", error);
    res.status(500).end("Error: " + (error instanceof Error ? error.message : String(error)));
  }
});

app.get("/vaultmesh", (req, res) => {
  try {
    console.log("🎯 PRODUCTION: SERVING YOUR AUTHENTIC VAULTMESH");
    const checkout = directServer.getVaultMeshCheckout();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.end(checkout);
  } catch (error) {
    console.error("❌ CRITICAL ERROR:", error);
    res.status(500).end("Error: " + (error instanceof Error ? error.message : String(error)));
  }
});

// Catch all other routes and redirect to main dashboard
app.get("*", (req, res) => {
  console.log("🎯 REDIRECTING TO YOUR AUTHENTIC DASHBOARD");
  res.redirect(301, "/");
});

const server = createServer(app);
const port = parseInt(process.env.PORT || '5000', 10);

server.listen({
  port,
  host: "0.0.0.0",
  reusePort: true,
}, () => {
  console.log(`🎯 PRODUCTION SERVER: Serving ONLY YOUR authentic templates on port ${port}`);
});