const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Load YOUR authentic templates directly
let sectorIndexDashboard;
let vaultMeshCheckout;

try {
  sectorIndexDashboard = fs.readFileSync(
    path.join(__dirname, 'attached_assets/Pasted--DOCTYPE-html-html-lang-en-head-meta-charset-UTF-8-meta-name-viewport-content-1753731844821_1753731844826.txt'),
    'utf8'
  );
  console.log('✅ Loaded YOUR authentic Sector Index Dashboard');
  
  vaultMeshCheckout = fs.readFileSync(
    path.join(__dirname, 'attached_assets/Pasted--DOCTYPE-html-html-lang-en-head-meta-charset-UTF-8-meta-name-viewport-content-1753730797853_1753730797855.txt'),
    'utf8'
  );
  console.log('✅ Loaded YOUR authentic VaultMesh Checkout');
} catch (error) {
  console.error('❌ Error loading templates:', error);
  process.exit(1);
}

// Serve ONLY YOUR authentic templates
app.get('/', (req, res) => {
  console.log('🎯 SERVING YOUR AUTHENTIC SECTOR INDEX DASHBOARD');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.send(sectorIndexDashboard);
});

app.get('/dashboard', (req, res) => {
  console.log('🎯 SERVING YOUR AUTHENTIC DASHBOARD');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.send(sectorIndexDashboard);
});

app.get('/vaultmesh', (req, res) => {
  console.log('🎯 SERVING YOUR AUTHENTIC VAULTMESH');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.send(vaultMeshCheckout);
});

// Redirect everything else to main dashboard
app.get('*', (req, res) => {
  res.redirect('/');
});

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`🎯 SERVING ONLY YOUR AUTHENTIC TEMPLATES ON PORT ${port}`);
  console.log(`Main Dashboard: http://localhost:${port}/`);
  console.log(`VaultMesh: http://localhost:${port}/vaultmesh`);
});