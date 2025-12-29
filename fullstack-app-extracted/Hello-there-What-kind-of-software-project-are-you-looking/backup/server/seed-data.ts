import { insertBrandSchema, insertSectorSchema, insertTemplateSchema, type Brand, type Sector, type Templates } from "@shared/schema";

const banimalFooterTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Banimal Global Impact Footer</title>
</head>
<body>
    <footer class="bg-gray-900 text-white py-8">
        <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">Banimal™: Kind Creatures. Global Impact.</h1>
            <p class="text-lg mb-6">Thoughtful baby essentials and innovative lighting for every child.</p>
        </div>
    </footer>
</body>
</html>`;

// Enhanced VaultMesh checkout with YOUR authentic Banimal Loop Checkout
const enhancedVaultMeshCheckoutTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌐 Global Synergy Hub - Seedwave™ | VaultMesh™ | Banimal™</title>
    <!-- PayPal SDK for Hosted Buttons -->
    <script
      src="https://www.paypal.com/sdk/js?client-id=BAAGdPecRsf6dw_nIrWqUen0GdW0UsBZapp1Gn62xkPdD-Vqc-4lqWAidKK8LOObXux8pHJGjXknZoar6Q&components=hosted-buttons&disable-funding=venmo&currency=USD">
    </script>
    <!-- Tailwind CSS CDN for styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts - Inter for clean typography -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Chart.js for the new pulse graph -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.js"></script>
    <style>
        /* Consolidated Base Styles and Theme Variables */
        :root {
            /* Text Colors */
            --text-color-light: #1d1d1f;
            --text-color-dark: #f5f5f7;
            --muted-text-light: #6e6e73;
            --muted-text-dark: #a0a0a5;

            /* Background Colors */
            --bg-color-light: #f5f5f7;
            --bg-color-dark: #1a1a1c; /* Default dark background for most sections */
            --dark-bg-seedwave: #0a0a0d; /* Slightly darker for specific Seedwave sections like hero canvas background */

            /* Card/Element Backgrounds */
            --card-bg-light: #ffffff;
            --card-bg-dark: #2a2a2e; /* General card background */
            --card-bg-seedwave: #1c1c21; /* Darker card background for Seedwave metrics/spotify */

            /* Border Colors */
            --border-color-light: #e8e8ed;
            --border-color-dark: #3a3a3e; /* General border color */
            --border-dark-seedwave: #3a3a42; /* Slightly darker border for Seedwave elements */

            /* Primary/Accent Colors */
            --primary-color: #0071e3; /* Apple Blue (General primary for MindLift) */
            --mindlift-color: #7B68EE; /* MediumPurple for MindLift theme */
            --mindlift-accent-color: #9370DB; /* Brighter purple for MindLift */
            --primary-glow-seedwave: #00e393; /* Greenish glow, Tesla-inspired (Seedwave) */
            --secondary-glow-seedwave: #007bff; /* Blue glow, Google/Apple-inspired (Seedwave) */
            --seedwave-green-glow-text: #00e393; /* Specific lime green glow for Seedwave header */
            --accent-red-seedwave: #ff4d4d; /* Red accent for Seedwave charts */

            /* Specific Card Colors (for Pricing and other sections) */
            --pro-card-bg-light: #f0e6fa;
            --pro-card-bg-dark: #3c3c42;
            --pro-border-light: #c2a7e7;
            --pro-border-dark: #5c5c63;
            --pro-button-color: #8A2BE2;
            --pro-button-hover-color: #6A1FB8;

            --enterprise-card-bg-light: #e6f0ff;
            --enterprise-card-bg-dark: #222225;
            --enterprise-border-light: #a0c3ff;
            --enterprise-border-dark: #4a4a50;
            --enterprise-button-color: #483D8B;
            --enterprise-button-hover-color: #382D7B;

            --banimal-card-bg-light: #e0ffe0;
            --banimal-card-bg-dark: #1f3d2f;
            --banimal-border-light: #a8d5a8;
            --banimal-border-dark: #3a5c3e;
            --banimal-button-color: #4CAF50;
            --banimal-button-hover-color: #388E3C;

            /* Other Specific Colors */
            --fcu-color: #4CAF50; /* Green for announcement bar, matches banimal button */
            --fcu-accent-color: #66BB6A;

            --secure-sign-purple: #8A2BE2;
            --secure-sign-blue: #4169E1;
            --secure-sign-purple-hover: #7b27cb;
            --secure-sign-blue-hover: #375ac7;

            /* Dynamic Heights for Layout (managed by JS) */
            --announcement-bar-height: 0px;

            /* Hyper Mode Colors */
            --hyper-bg-color: #000033;
            --hyper-text-color: #FFCCFF;
            --hyper-card-bg: #110044;
            --hyper-border-color: #330066;
            --hyper-primary-color: #FF00FF; /* Magenta */
            --hyper-accent-color: #FF69B4; /* HotPink */
        }

        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            transition: background-color 0.3s ease, color 0.3s ease;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            /* Default to dark mode */
            background-color: var(--bg-color-dark);
            color: var(--text-color-dark);
            overflow-x: hidden; /* Prevent horizontal scrolling */
        }

        /* Light Mode */
        body.light-mode {
            background-color: var(--bg-color-light);
            color: var(--text-color-light);
        }
        .light-mode .section-padding {
            background-color: var(--card-bg-light);
            border-color: var(--border-color-light);
        }
        .light-mode .section-title {
            color: var(--text-color-light);
        }
        .light-mode .feature-card,
        .light-mode .metadata-card,
        .light-mode .pricing-card,
        .light-mode .currency-converter-section,
        .light-mode .fixed-pricing-section,
        .light-mode #top-tracks-list,
        .light-mode #playlist-message,
        .light-mode #audio-players,
        .light-mode #spotify-album-embed {
            background-color: var(--card-bg-light);
            border-color: var(--border-color-light);
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .light-mode .pricing-card.pro-card { background-color: var(--pro-card-bg-light); border-color: var(--pro-border-light); }
        .light-mode .pricing-card.enterprise-card { background-color: var(--enterprise-card-bg-light); border-color: var(--enterprise-border-light); }
        .light-mode .pricing-card.banimal-card { background-color: var(--banimal-card-bg-light); border-color: var(--banimal-border-light); }
        .light-mode .feature-card h3,
        .light-mode .metadata-card h3,
        .light-mode .pricing-card h3,
        .light-mode .currency-converter-section h2,
        .light-mode .fixed-pricing-section h2,
        .light-mode #top-tracks-list h3 {
            color: var(--text-color-light);
        }
        .light-mode .feature-card p,
        .light-mode .metadata-card ul li,
        .light-mode .pricing-card p,
        .light-mode .pricing-card ul li,
        .light-mode #top-tracks-list li {
            color: var(--muted-text-light);
        }
        .light-mode .metadata-card ul li strong { color: var(--text-color-light); }
        .light-mode .ai-help-section h3 { color: var(--text-color-light); }
        .light-mode .ai-help-section .form-label { color: var(--muted-text-light); }
        .light-mode .ai-help-section .form-input, .light-mode .ai-help-section .form-select {
            background-color: #f0f0f0;
            border-color: var(--border-color-light);
            color: var(--text-color-light);
        }
        .light-mode .ai-help-section .form-input::placeholder { color: #888; }
        .light-mode #node-pulse-graph .w-full { background-color: #e8e8ed; border-color: #d1d1d1; }
        .light-mode #node-pulse-graph p { color: var(--muted-text-light); }
        .light-mode footer.new-footer { background-color: #d1d1d1; border-top-color: #a0a0a5; }
        .light-mode footer.new-footer h1 { color: var(--text-color-light); }
        .light-mode footer.new-footer p { color: var(--muted-text-light); }
        .light-mode footer.new-footer a { color: var(--primary-color); }
        .light-mode .theme-controls button,
        .light-mode .theme-controls #languageSwitcher {
            background-color: var(--card-bg-light);
            color: var(--text-color-light);
            border-color: var(--border-color-light);
        }
        .light-mode .theme-controls #theme-day-btn.active {
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        .light-mode .theme-controls #theme-night-btn,
        .light-mode .theme-controls #theme-hyper-btn {
            background-color: var(--card-bg-light);
            color: var(--muted-text-light);
            border-color: var(--border-color-light);
        }
        .light-mode .theme-controls #languageSwitcher {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236e6e73'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
        }
        .light-mode .header-content-wrapper {
            background-color: rgba(255, 255, 255, 0.8);
            border-bottom-color: var(--border-color-light);
        }
        .light-mode .logo-group {
            color: var(--text-color-light);
        }
        .light-mode .logo-fruitful { color: var(--primary-color); }
        .light-mode .logo-separator { color: var(--muted-text-light); }
        .light-mode .logo-seedwave { color: var(--primary-glow-seedwave); text-shadow: 0 0 10px rgba(0, 227, 147, 0.3); }
        .light-mode #header-pulse-canvas { background-color: transparent; }
        .light-mode .hero-section {
            background: radial-gradient(circle at center, rgba(0, 227, 147, 0.05) 0%, transparent 60%);
        }
        .light-mode .pulse-container {
            background-color: #f8f8f8;
            border-color: var(--border-color-light);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .light-mode .pulse-container canvas { background-color: transparent; }
        .light-mode .whimsical-card {
            background-color: var(--card-bg-light);
            border-color: var(--border-color-light);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        .light-mode .whimsical-card h3 { color: var(--text-color-light); }
        .light-mode .whimsical-card p { color: var(--muted-text-light); }
        .light-mode .whimsical-icon { text-shadow: 0 0 15px rgba(0, 227, 147, 0.2); }
        .light-mode .spotify-btn-secondary { background-color: #ddd; color: #333; border-color: #bbb; }
        .light-mode .spotify-btn-secondary:hover { background-color: #ccc; }
        .light-mode .currency-converter-section input,
        .light-mode .currency-converter-section select {
            background-color: #f0f0f0;
            border-color: var(--border-color-light);
            color: var(--text-color-light);
        }
        .light-mode .pricing-card .price { /* Apply gradient for default pricing */
            background: linear-gradient(90deg, var(--primary-color), var(--mindlift-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Dark Mode */
        body.dark-mode {
            background-color: var(--bg-color-dark);
            color: var(--text-color-dark);
        }
        .dark-mode .section-padding {
            background-color: var(--card-bg-dark);
            border-color: var(--border-color-dark);
        }
        .dark-mode .section-title {
            color: var(--text-color-dark);
        }
        .dark-mode .feature-card,
        .dark-mode .metadata-card,
        .dark-mode .pricing-card,
        .dark-mode .currency-converter-section,
        .dark-mode .fixed-pricing-section,
        .dark-mode #top-tracks-list,
        .dark-mode #playlist-message,
        .dark-mode #audio-players,
        .dark-mode #spotify-album-embed {
            background-color: var(--card-bg-dark);
            border-color: var(--border-color-dark);
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        }
        .dark-mode .pricing-card.pro-card { background-color: var(--pro-card-bg-dark); border-color: var(--pro-border-dark); }
        .dark-mode .pricing-card.enterprise-card { background-color: var(--enterprise-card-bg-dark); border-color: var(--enterprise-border-dark); }
        .dark-mode .pricing-card.banimal-card { background-color: var(--banimal-card-bg-dark); border-color: var(--banimal-border-dark); }
        .dark-mode .feature-card h3,
        .dark-mode .metadata-card h3,
        .dark-mode .pricing-card h3,
        .dark-mode .currency-converter-section h2,
        .dark-mode .fixed-pricing-section h2,
        .dark-mode #top-tracks-list h3 {
            color: var(--text-color-dark);
        }
        .dark-mode .feature-card p,
        .dark-mode .metadata-card ul li,
        .dark-mode .pricing-card p,
        .dark-mode .pricing-card ul li,
        .dark-mode #top-tracks-list li {
            color: var(--muted-text-dark);
        }
        .dark-mode .metadata-card ul li strong { color: var(--text-color-dark); }
        .dark-mode .ai-help-section h3 { color: var(--text-color-dark); }
        .dark-mode .ai-help-section .form-label { color: var(--muted-text-dark); }
        .dark-mode .ai-help-section .form-input, .dark-mode .ai-help-section .form-select {
            background-color: #3a3a3e;
            border-color: var(--border-color-dark);
            color: var(--text-color-dark);
        }
        .dark-mode .ai-help-section .form-input::placeholder { color: #718096; }
        .dark-mode #node-pulse-graph .w-full { background-color: #0a0a0d; border-color: #3a3a3e; }
        .dark-mode #node-pulse-graph p { color: var(--muted-text-dark); }
        .dark-mode footer.new-footer { background-color: #1a1a1a; border-top-color: #2a2a2e; }
        .dark-mode footer.new-footer h1 { color: #ffffff; }
        .dark-mode footer.new-footer p { color: #d1d5db; }
        .dark-mode footer.new-footer a { color: #60a5fa; }
        .dark-mode .theme-controls button,
        .dark-mode .theme-controls #languageSwitcher {
            background-color: var(--card-bg-dark);
            color: var(--text-color-dark);
            border-color: var(--border-color-dark);
        }
        .dark-mode .theme-controls #theme-night-btn.active {
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        .dark-mode .theme-controls #theme-day-btn,
        .dark-mode .theme-controls #theme-hyper-btn {
            background-color: var(--card-bg-dark);
            color: var(--muted-text-dark);
            border-color: var(--border-color-dark);
        }
        .dark-mode .theme-controls #languageSwitcher {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23a0a0a5'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
        }
        .dark-mode header {
            background-color: rgba(10, 10, 13, 0.8);
            border-bottom-color: var(--border-dark-seedwave);
        }
        .dark-mode .hero-section {
            background: radial-gradient(circle at center, rgba(0, 227, 147, 0.05) 0%, transparent 60%);
        }
        .dark-mode .pulse-container {
            background-color: var(--card-bg-seedwave);
            border-color: var(--border-dark-seedwave);
        }
        .dark-mode .whimsical-card {
            background-color: var(--card-bg-dark);
            border-color: var(--border-color-dark);
        }
        .dark-mode .spotify-btn-secondary { background-color: #333; color: #fff; border-color: #555; }
        .dark-mode .spotify-btn-secondary:hover { background-color: #555; }
        .dark-mode .currency-converter-section input,
        .dark-mode .currency-converter-section select {
            background-color: #2a2a30;
            border-color: var(--border-color-dark);
            color: var(--light-text);
        }
        .dark-mode .pricing-card .price { /* Apply gradient for default pricing */
            background: linear-gradient(90deg, var(--primary-glow-seedwave), var(--secondary-glow-seedwave));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Hyper Mode */
        body.hyper-mode {
            background-color: var(--hyper-bg-color);
            color: var(--hyper-text-color);
        }
        .hyper-mode .mindlift-hero {
            background: linear-gradient(135deg, var(--hyper-primary-color) 0%, var(--hyper-accent-color) 100%);
            box-shadow: 0 10px 30px rgba(255, 0, 255, 0.4);
        }
        .hyper-mode .section-padding {
            background-color: var(--hyper-card-bg);
            border-color: var(--hyper-border-color);
        }
        .hyper-mode .section-title {
            color: var(--hyper-text-color);
        }
        .hyper-mode .feature-card,
        .hyper-mode .metadata-card,
        .hyper-mode .pricing-card,
        .hyper-mode .currency-converter-section,
        .hyper-mode .fixed-pricing-section,
        .hyper-mode #top-tracks-list,
        .hyper-mode #playlist-message,
        .hyper-mode #audio-players,
        .hyper-mode #spotify-album-embed {
            background-color: var(--hyper-card-bg);
            border-color: var(--hyper-border-color);
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
        }
        .hyper-mode .pricing-card.pro-card { background-color: var(--hyper-card-bg); border-color: var(--hyper-border-color); }
        .hyper-mode .pricing-card.enterprise-card { background-color: var(--hyper-card-bg); border-color: var(--hyper-border-color); }
        .hyper-mode .pricing-card.banimal-card { background-color: var(--hyper-card-bg); border-color: var(--hyper-border-color); }
        .hyper-mode .feature-card h3,
        .hyper-mode .metadata-card h3,
        .hyper-mode .pricing-card h3,
        .hyper-mode .currency-converter-section h2,
        .hyper-mode .fixed-pricing-section h2,
        .hyper-mode #top-tracks-list h3 {
            color: var(--hyper-text-color);
        }
        .hyper-mode .feature-card .icon,
        .hyper-mode .ai-help-section h3 i {
            color: var(--hyper-accent-color);
        }
        .hyper-mode .feature-card p,
        .hyper-mode .metadata-card ul li,
        .hyper-mode .pricing-card p,
        .hyper-mode .pricing-card ul li,
        .hyper-mode #top-tracks-list li {
            color: var(--hyper-text-color); /* Adjusted for better contrast in hyper mode */
        }
        .hyper-mode .metadata-card ul li strong { color: var(--hyper-text-color); }
        .hyper-mode .ai-help-section h3 { color: var(--hyper-text-color); }
        .hyper-mode .ai-help-section .form-label { color: var(--hyper-text-color); }
        .hyper-mode .ai-help-section .form-input, .hyper-mode .ai-help-section .form-select {
            background-color: #000022;
            border-color: var(--hyper-border-color);
            color: var(--hyper-text-color);
        }
        .hyper-mode .ai-help-section .form-input::placeholder { color: #FFCCFF; }
        .hyper-mode #node-pulse-graph .w-full { background-color: #000011; border-color: #330066; }
        .hyper-mode #node-pulse-graph p { color: var(--hyper-text-color); }
        .hyper-mode footer.new-footer { background-color: var(--hyper-card-bg); border-top-color: var(--hyper-border-color); }
        .hyper-mode footer.new-footer h1 { color: var(--hyper-text-color); }
        .hyper-mode footer.new-footer p { color: var(--hyper-text-color); }
        .hyper-mode footer.new-footer a { color: var(--hyper-text-color); }
        .hyper-mode .theme-controls button,
        .hyper-mode .theme-controls #languageSwitcher {
            background-color: var(--hyper-card-bg);
            color: var(--hyper-text-color);
            border-color: var(--hyper-border-color);
        }
        .hyper-mode .theme-controls #theme-hyper-btn.active {
            background-color: var(--hyper-primary-color);
            color: white;
            border-color: var(--hyper-primary-color);
        }
        .hyper-mode .theme-controls #theme-day-btn,
        .hyper-mode .theme-controls #theme-night-btn {
            background-color: var(--hyper-card-bg);
            color: var(--muted-text-dark); /* Use a muted version of hyper-text for non-active */
            border-color: var(--hyper-border-color);
        }
        .hyper-mode .theme-controls #languageSwitcher {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23FFCCFF'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
        }
        .hyper-mode header {
            background-color: rgba(0, 0, 15, 0.8);
            border-bottom-color: var(--hyper-border-color);
        }
        .hyper-mode .logo-group {
            color: var(--hyper-text-color);
        }
        .hyper-mode .logo-fruitful { color: var(--hyper-primary-color); }
        .hyper-mode .logo-separator { color: var(--hyper-text-color); }
        .hyper-mode .logo-seedwave { color: var(--hyper-accent-color); text-shadow: 0 0 10px rgba(255, 0, 255, 0.6); }
        .hyper-mode #header-pulse-canvas { background-color: transparent; }
        .hyper-mode .hero-section {
            background: radial-gradient(circle at center, rgba(255, 0, 255, 0.08) 0%, transparent 60%);
        }
        .hyper-mode .pulse-container {
            background-color: var(--hyper-card-bg);
            border-color: var(--hyper-border-color);
        }
        .hyper-mode .whimsical-card {
            background-color: var(--hyper-card-bg);
            border-color: var(--hyper-border-color);
        }
        .hyper-mode .whimsical-card h3 { color: var(--hyper-text-color); }
        .hyper-mode .whimsical-card p { color: var(--hyper-text-color); }
        .hyper-mode .whimsical-icon { text-shadow: 0 0 15px rgba(255, 0, 255, 0.5); }
        .hyper-mode .spotify-btn-primary { background: linear-gradient(45deg, #00FF00, #00AA00); box-shadow: 0 4px 15px rgba(0, 255, 0, 0.4); }
        .hyper-mode .spotify-btn-primary:hover { background: linear-gradient(45deg, #00AA00, #00FF00); box-shadow: 0 6px 20px rgba(0, 255, 0, 0.6); }
        .hyper-mode .spotify-btn-secondary { background-color: #220044; color: var(--hyper-text-color); border-color: #5500AA; }
        .hyper-mode .spotify-btn-secondary:hover { background-color: #5500AA; }
        .hyper-mode .currency-converter-section input,
        .hyper-mode .currency-converter-section select {
            background-color: #000022;
            border-color: var(--hyper-border-color);
            color: var(--hyper-text-color);
        }
        .hyper-mode .pricing-card .price { /* Apply gradient for default pricing */
            background: linear-gradient(90deg, var(--hyper-primary-color), var(--hyper-accent-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 8px rgba(255, 0, 255, 0.3);
        }
        .hyper-mode .pricing-card.pro-card .price,
        .hyper-mode .pricing-card.enterprise-card .price,
        .hyper-mode .pricing-card.banimal-card .price { /* No special color override in hyper mode for consistency */
            color: var(--hyper-text-color);
        }
        .hyper-mode .pricing-card.pro-card ul li i,
        .hyper-mode .pricing-card.enterprise-card ul li i,
        .hyper-mode .pricing-card.banimal-card ul li i {
            color: var(--hyper-text-color);
        }


        /* Global Container & Section Defaults */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .section-padding {
            padding: 80px 20px;
            border-bottom: 1px solid var(--border-color-dark);
            border-top: 1px solid var(--border-color-dark);
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        .section-padding:last-of-type {
            border-bottom: none;
        }

        .section-title {
            font-size: 2.2rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 50px;
            transition: color 0.3s ease;
        }

        /* Announcement Bar Styling */
        #announcement-bar {
            background-color: var(--fcu-color);
            color: white;
            padding: 10px 20px;
            text-align: center;
            font-size: 0.9rem;
            position: sticky;
            top: 0;
            z-index: 1001;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #announcement-bar .close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
        }
        #announcement-bar.hidden {
            display: none;
        }

        /* Header Specifics */
        header {
            background-color: rgba(10, 10, 13, 0.8); /* Semi-transparent dark background */
            backdrop-filter: blur(10px); /* Frosted glass effect */
            border-bottom: 1px solid var(--border-dark-seedwave);
            padding: 1rem 2rem;
            position: sticky;
            top: var(--announcement-bar-height); /* Position header below announcement bar */
            z-index: 50;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .header-content-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .logo-group {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--light-text);
            transition: color 0.3s ease;
            flex-shrink: 0;
        }

        .logo-fruitful {
            color: var(--primary-color);
            font-size: 1.6rem;
            font-weight: 800;
            text-decoration: none;
        }

        .logo-separator {
            color: var(--muted-text-dark);
            font-size: 1.4rem;
            font-weight: 600;
        }
        
        .logo-seedwave {
            color: var(--seedwave-green-glow-text);
            font-size: 1.6rem;
            font-weight: 800;
            text-decoration: none;
            text-shadow: 0 0 10px rgba(0, 227, 147, 0.6);
        }

        #header-pulse-canvas {
            flex-grow: 1;
            height: 40px;
            background-color: transparent;
            margin: 0 20px;
            max-width: 600px;
        }

        /* Hero Sections (MindLift and Seedwave Pulse Grid) */
        .mindlift-hero {
            text-align: center;
            padding: 100px 20px;
            background: linear-gradient(135deg, var(--mindlift-color) 0%, var(--mindlift-accent-color) 100%);
            color: white;
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            margin: 20px auto;
            max-width: 1200px;
            box-shadow: 0 10px 30px rgba(123, 104, 238, 0.4);
            z-index: 9; /* Ensure it is below header but above general content */
        }
        .mindlift-hero h1 {
            font-size: 4rem;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 20px;
            letter-spacing: -0.05em;
            color: white;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
        }
        .mindlift-hero p {
            font-size: 1.5rem;
            max-width: 900px;
            margin: 0 auto 40px;
            line-height: 1.5;
            color: rgba(255, 255, 255, 0.9);
        }
        .mindlift-hero .cta-button {
            background-color: white;
            color: var(--mindlift-color);
            padding: 15px 40px;
            font-size: 1.1rem;
            border-radius: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: inline-block;
        }
        .mindlift-hero .cta-button:hover {
            background-color: #f0f0f0;
            color: var(--mindlift-accent-color);
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }

        .global-pulse-grid-section {
            padding: 6rem 2rem;
            text-align: center;
            background-color: var(--dark-bg-seedwave); /* Matches Seedwave section bg */
            border-top: 1px solid var(--border-dark-seedwave);
            border-bottom: 1px solid var(--border-dark-seedwave);
        }
        .global-pulse-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 1rem;
            width: 100%;
            height: 60vh; /* Adjust height as needed */
            max-width: 1200px;
            margin: 2rem auto;
        }
        .pulse-container {
            position: relative;
            background-color: var(--card-bg-seedwave);
            border-radius: 0.75rem;
            overflow: hidden;
            border: 1px solid var(--border-dark-seedwave);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            /* Added min-dimensions for rendering visibility */
            min-width: 150px;
            min-height: 150px;
        }
        .pulse-container canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: block;
            background-color: transparent;
            z-index: 1;
        }

        /* Metrics / Info Cards (Seedwave) */
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2.5rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .metric-card {
            background-color: var(--card-bg-seedwave);
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            border: 1px solid var(--border-dark-seedwave);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .metric-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 12px 30px rgba(0,0,0,0.4);
        }
        .metric-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(0, 227, 147, 0.1) 0%, transparent 70%);
            transform: rotate(45deg);
            opacity: 0;
            transition: opacity 0.5s ease;
            z-index: 0;
        }
        .metric-card:hover::before {
            opacity: 1;
        }
        .metric-card-content {
            position: relative;
            z-index: 1;
        }
        .metric-card-icon {
            font-size: 3.5rem;
            color: var(--primary-glow-seedwave);
            margin-bottom: 1rem;
            text-shadow: 0 0 15px rgba(0, 227, 147, 0.5);
        }
        .metric-card h3 {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--light-text);
            margin-bottom: 0.5rem;
        }
        .metric-card p {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.7);
        }
        .metric-value {
            font-size: 2.8rem;
            font-weight: 900;
            background: linear-gradient(90deg, var(--primary-glow-seedwave), var(--secondary-glow-seedwave));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 10px rgba(0, 227, 147, 0.5);
            margin-top: 1rem;
            display: block;
        }

        /* Master License Brands & Whimsical Ventures (Seedwave) */
        .whimsical-card-grid, .master-brands-grid { /* Reusing styles for master brands as well */
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2.5rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .whimsical-card {
            background-color: var(--card-bg-seedwave);
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            border: 1px solid var(--border-dark-seedwave);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        .whimsical-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 12px 30px rgba(0,0,0,0.4);
        }
        .whimsical-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            line-height: 1;
            text-shadow: 0 0 15px rgba(0, 227, 147, 0.5);
        }
        .whimsical-card h3 {
            font-size: 2rem;
            font-weight: 700;
            color: var(--light-text);
            margin-bottom: 0.75rem;
        }
        .whimsical-card p {
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.7);
            flex-grow: 1;
        }

        /* Feature Grid Layout (MindLift) */
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }
        .feature-card {
            background-color: var(--card-bg-dark);
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            border: 1px solid var(--border-color-dark);
            text-align: left;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card .icon {
            font-size: 2.5rem;
            color: var(--mindlift-color);
            margin-bottom: 15px;
        }
        .feature-card h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .feature-card p {
            font-size: 1rem;
            line-height: 1.6;
        }
        .feature-card ul {
            list-style: none;
            padding: 0;
            margin-top: 15px;
        }
        .feature-card ul li {
            font-size: 0.95rem;
            margin-bottom: 5px;
        }

        /* Metadata Metrics Section (MindLift) */
        .metadata-metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-top: 50px;
        }
        .metadata-card {
            background-color: var(--card-bg-dark); /* Using general card bg */
            padding: 30px;
            border-radius: 12px;
            border: 1px solid var(--border-color-dark);
            text-align: left;
            box-shadow: 0 1px 5px rgba(0,0,0,0.15);
        }
        .metadata-card h3 {
            font-size: 1.5rem;
            font-weight: 600;
        }
        .metadata-card ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .metadata-card ul li {
            font-size: 0.95rem;
            margin-bottom: 8px;
            line-height: 1.5;
        }

        /* Pricing Section (MindLift with Banimal Loop Plan) */
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-top: 50px;
            align-items: start;
            justify-content: center;
        }
        @media (min-width: 1024px) {
            .pricing-grid {
                grid-template-columns: repeat(4, 1fr);
            }
        }
        .pricing-card {
            background-color: var(--card-bg-dark); /* Using general card bg */
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            border: 1px solid var(--border-color-dark);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: transform 0.2s ease;
            height: 100%;
            text-align: left;
            max-width: 450px;
            margin: 0 auto;
        }
        .pricing-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.4);
        }
        .pricing-card.highlight { /* Used for Pro plan in MindLift original */
            border-color: var(--mindlift-color);
            box-shadow: 0 8px 25px rgba(123, 104, 238, 0.3);
        }
        .pricing-card h3 {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 10px;
            text-align: center;
        }
        .pricing-card .price {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 15px;
            text-align: center;
        }
        .pricing-card .price-description {
            font-size: 0.95rem;
            margin-bottom: 15px;
            text-align: center;
        }
        .pricing-card ul {
            list-style: none;
            padding: 0;
            margin-bottom: 20px;
            text-align: left;
            width: 100%;
            flex-grow: 1;
        }
        .pricing-card ul li {
            font-size: 0.95rem;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }
        .pricing-card ul li i {
            color: var(--mindlift-color); /* Default checkmark color */
            margin-right: 10px;
        }
        /* Overrides for specific pricing card checkmark colors */
        .pricing-card.pro-card ul li i { color: var(--pro-button-color); }
        .pricing-card.enterprise-card ul li i { color: var(--enterprise-button-color); }
        .pricing-card.banimal-card ul li i { color: var(--banimal-button-color); }

        /* Currency Converter (Seedwave) */
        .currency-converter-section {
            background-color: var(--card-bg-seedwave);
            border-radius: 1rem;
            padding: 3rem;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            border: 1px solid var(--border-dark-seedwave);
            max-width: 800px;
            margin: 4rem auto;
            text-align: center;
        }
        .currency-converter-section h2 {
            margin-bottom: 2rem;
            font-size: 2.5rem;
            color: var(--primary-glow-seedwave);
            text-shadow: 0 0 10px rgba(0, 227, 147, 0.4);
        }
        .currency-inputs {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 2rem;
            align-items: center;
        }
        .currency-input-group {
            display: flex;
            align-items: center;
            gap: 1rem;
            width: 100%;
            max-width: 400px;
        }
        .currency-input-group label {
            font-size: 1.1rem;
            color: var(--light-text);
            white-space: nowrap;
        }
        .currency-input-group input,
        .currency-input-group select {
            flex-grow: 1;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            border: 1px solid var(--border-dark-seedwave);
            background-color: #2a2a30;
            color: var(--light-text);
            font-size: 1rem;
        }
        .currency-input-group input:focus,
        .currency-input-group select:focus {
            outline: none;
            border-color: var(--primary-glow-seedwave);
            box-shadow: 0 0 0 3px rgba(0, 227, 147, 0.3);
        }
        .convert-button {
            padding: 1rem 2.5rem;
            background: linear-gradient(45deg, #007bff, #0056b3);
            color: white;
            border: none;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
            box-shadow: 0 5px 20px rgba(0, 123, 255, 0.4);
        }
        .convert-button:hover {
            background: linear-gradient(45deg, #0056b3, #007bff);
            box-shadow: 0 8px 25px rgba(0, 123, 255, 0.6);
            transform: translateY(-2px);
        }
        .conversion-result {
            margin-top: 2rem;
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--light-text);
        }

        /* Spotify Integration (Seedwave) */
        .spotify-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
            margin-bottom: 3rem;
        }
        .spotify-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.8rem 1.5rem;
            border-radius: 9999px;
            font-weight: 600;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
            border: none;
            text-decoration: none;
        }
        .spotify-btn-primary {
            background: linear-gradient(45deg, #1DB954, #128A3C);
            color: white;
            box-shadow: 0 4px 15px rgba(29, 185, 84, 0.4);
        }
        .spotify-btn-primary:hover {
            background: linear-gradient(45deg, #128A3C, #1DB954);
            box-shadow: 0 6px 20px rgba(29, 185, 84, 0.6);
            transform: translateY(-2px);
        }
        .spotify-btn-secondary {
            background-color: #333;
            color: #fff;
            border: 1px solid #555;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .spotify-btn-secondary:hover {
            background-color: #555;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transform: translateY(-2px);
        }
        #top-tracks-list, #playlist-message, #audio-players, #spotify-album-embed {
            background-color: var(--card-bg-seedwave);
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin-top: 1.5rem;
            border: 1px solid var(--border-dark-seedwave);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            text-align: left;
        }
        #top-tracks-list ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        #top-tracks-list li {
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            color: rgba(255,255,255,0.8);
        }
        #top-tracks-list li:last-child {
            border-bottom: none;
        }
        #top-tracks-list li strong {
            color: var(--primary-glow-seedwave);
        }
        #playlist-message {
            color: var(--light-text);
            font-weight: 500;
        }
        #audio-players {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        #audio-players iframe {
            width: 100%;
            height: 80px;
            border-radius: 12px;
            border: none;
        }
        #spotify-album-embed iframe {
            width: 100%;
            border-radius: 12px;
            border: none;
        }

        /* Node.js Infiltration Pulse Graph (Seedwave) */
        #node-pulse-graph .w-full {
            background-color: #0a0a0d; /* Matching seedwave dark bg */
            padding: 6px; /* Reduced padding to look sleek */
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 1px solid var(--border-dark-seedwave);
        }
        #node-pulse-graph p {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.5);
            margin-top: 1rem;
        }

        /* AI Help/FAQ Section (MindLift) */
        .ai-help-section h3 {
            display: flex;
            align-items: center;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .ai-help-section h3 i {
            color: var(--mindlift-accent-color);
            margin-right: 15px;
            font-size: 1.8rem;
        }
        .ai-help-section .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
        }
        .ai-help-section .form-input, .ai-help-section .form-select {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid var(--border-color-dark);
            border-radius: 8px;
            background-color: #3a3a3e;
            font-size: 1rem;
            box-sizing: border-box;
            transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
        }
        .ai-help-section .form-input::placeholder {
            color: #718096;
        }
        .ai-help-section .form-input:focus, .ai-help-section .form-select:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2);
        }
        .ai-help-section .checkout-action-button {
            display: block;
            width: 100%;
            height: 56px;
            font-size: 1.125rem;
            font-weight: 700;
            color: white;
            border: none;
            border-radius: 9999px;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            background-color: var(--secure-sign-purple);
        }
        .ai-help-section .checkout-action-button:hover {
            background-color: var(--secure-sign-purple-hover);
            transform: translateY(-2px);
        }
        .ai-help-section .hidden {
            display: none;
        }
        .ai-help-section .result-text {
            white-space: pre-wrap;
            margin-top: 1rem;
        }

        /* Disclaimer Section */
        .disclaimer-section {
            background-color: var(--card-bg-dark); /* Changed to dark card bg */
            padding: 40px 20px;
            text-align: center;
            font-size: 0.9rem;
            color: #cc0000;
            border-top: 1px solid var(--border-color-dark);
            margin-top: 40px;
        }
        .disclaimer-section p strong {
            font-weight: 700;
        }

        /* Planet Pulse Text Styling */
        #planet-text {
            font-size: 2rem;
            font-weight: 700;
            text-align: center;
            margin-top: 40px;
            margin-bottom: 40px;
            color: var(--mindlift-color);
            overflow: hidden;
            white-space: nowrap;
            animation: pulse-glow 3s infinite alternate;
            transition: all 0.5s ease-in-out;
            text-shadow: none;
        }
        @keyframes pulse-glow {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.05); opacity: 0.9; }
        }

        /* Consolidated Footer */
        .new-footer {
            background-color: #050508; /* Even darker footer from Seedwave template */
            color: rgba(255, 255, 255, 0.5); /* Muted text */
            padding: 2.5rem; /* Matches Seedwave template padding */
            text-align: center;
            margin-top: auto;
            border-top: 1px solid #2a2a30; /* Matches Seedwave template border */
            font-size: 0.9rem;
        }
        .new-footer a {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            transition: color 0.3s ease;
        }
        .new-footer a:hover {
            color: var(--primary-glow-seedwave); /* Using Seedwave glow for consistency */
        }
        .banimal-footer-content {
            max-width: 48rem;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 2rem; /* Add space for content above copyright */
        }
        .banimal-footer-content h1 {
            font-size: 2rem;
            font-weight: 800;
            line-height: 1.25;
            color: #ffffff;
            margin-bottom: 0.5rem;
        }
        .banimal-footer-content .text-blue-400 {
            color: #60a5fa;
        }
        .banimal-footer-content p {
            font-size: 1rem;
            line-height: 1.625;
            color: #d1d5db;
            margin-bottom: 1.5rem;
        }
        .new-footer .cta-button {
            background-color: #3b82f6;
            color: #ffffff;
            font-weight: 600;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition-property: background-color;
            transition-duration: 0.2s;
            text-decoration: none;
        }
        .new-footer .cta-button:hover {
            background-color: #2563eb;
        }
        .new-footer .cta-button .ml-2 {
            margin-left: 0.5rem;
        }
        .new-footer .copyright {
            font-size: 0.875rem;
            color: #6b7280;
            margin-top: 2rem;
        }

        /* Theme Controls */
        .theme-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            space-x: 4px;
            margin-top: 1rem;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .theme-controls button {
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 500;
            transition: all 0.3s ease;
            cursor: pointer;
            border: 1px solid transparent;
            flex-shrink: 0;
            white-space: nowrap;
        }
        .theme-controls #languageSwitcher {
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 500;
            transition: all 0.3s ease;
            cursor: pointer;
            border: 1px solid var(--border-color-dark);
            background-color: var(--card-bg-dark);
            color: var(--text-color-dark);
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 1.5em;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23a0a0a5'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
            padding-right: 2.5rem;
            width: fit-content;
            min-width: 120px;
            max-width: 180px;
            flex-grow: 0;
            flex-shrink: 1;
        }

        /* Responsive Adjustments */
        @media (max-width: 1024px) {
            .global-pulse-grid {
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(3, 1fr);
                height: auto; /* Allow height to adjust */
            }
            .pricing-grid {
                grid-template-columns: repeat(2, 1fr); /* 2 columns on tablet */
            }
        }
        @media (max-width: 768px) {
            header { padding: 1rem; }
            .logo-group .logo-fruitful, .logo-group .logo-seedwave { font-size: 1.4rem; }
            .logo-separator { font-size: 1.2rem; }
            #header-pulse-canvas { display: none; }
            .mindlift-hero h1 { font-size: 2.8rem; }
            .mindlift-hero p { font-size: 1.2rem; }
            .global-pulse-grid {
                grid-template-columns: 1fr;
                grid-template-rows: repeat(6, 1fr);
                max-height: none;
            }
            .section-title { font-size: 2.2rem; }
            .section-padding { padding: 4rem 1rem; }
            .metrics-grid, .whimsical-card-grid, .feature-grid, .metadata-metrics-grid, .pricing-grid {
                grid-template-columns: 1fr;
            }
            .metric-card-icon { font-size: 3rem; }
            .metric-card h3 { font-size: 1.5rem; }
            .metric-value { font-size: 2.2rem; }
            .whimsical-icon { font-size: 3.5rem; }
            .whimsical-card h3 { font-size: 1.8rem; }
            .whimsical-card p { font-size: 1rem; }
            .currency-converter-section { padding: 2rem; }
            .currency-converter-section h2 { font-size: 2rem; }
            .pricing-card { padding: 30px; }
            .pricing-card h3 { font-size: 1.6rem; }
            .pricing-card .price { font-size: 2rem; }
            .spotify-controls { flex-direction: column; }
            #node-pulse-graph .w-full { padding: 10px; }
            .ai-help-section h3 { font-size: 1.3rem; flex-direction: column; text-align: center; }
            .ai-help-section h3 i { margin-right: 0; margin-bottom: 10px; }
            #planet-text { font-size: 1.5rem; }
            .new-footer { padding: 1.5rem; }
            .banimal-footer-content h1 { font-size: 2.25rem; }
            .banimal-footer-content p { font-size: 0.9rem; }
            .new-footer .cta-button { padding: 0.6rem 1.2rem; font-size: 0.9rem; }
        }
    </style>
</head>
<body>
    <!-- NEW: Announcement Bar from MindLift template -->
    <div id="announcement-bar" class="bg-fcu-color text-white text-center p-2 text-sm relative z-50">
        <div class="container flex justify-center items-center">
            <span data-lang-key="announcement-text">🚀 Accelerate Your Workflow! Get 15% off Pro Grid for a limited time!</span>
            <button class="close-btn text-white text-lg ml-4" aria-label="Close Announcement">&times;</button>
        </div>
    </div>

    <header>
        <div class="header-content-wrapper">
            <div class="logo-group">
                <a href="#" class="logo-fruitful">Fruitful™</a>
                <span class="logo-separator">|</span>
                <span class="logo-seedwave">Seedwave™</span>
            </div>
            <!-- New: Stock Exchange Pulse Canvas in Header -->
            <canvas id="header-pulse-canvas"></canvas>
        </div>
    </header>

    <main>
        <!-- MindLift Hero Section -->
        <section id="overview" class="mindlift-hero">
            <div class="container">
                <h1>VaultMesh™ | AgroChain™ Core Protocol</h1>
                <p>AgroChain™ is a powerful FAA.zone™ framework empowering the Agriculture & Biotech sector with advanced automation and data management. It connects effortlessly to the PulseGrid™ for optimized workflow and compliance.</p>
                <a href="#pricing" class="cta-button">View Pricing &rarr;</a>
            </div>
        </section>

        <!-- Global Pulse Grid Section (from Seedwave template) -->
        <section class="global-pulse-grid-section">
            <h2 class="section-title text-light-text">Global Data Pulse & Innovation</h2>
            <div class="global-pulse-grid">
                <div class="pulse-container">
                    <canvas id="canvas-rhythmic"></canvas>
                </div>
                <div class="pulse-container">
                    <canvas id="canvas-concentric"></canvas>
                </div>
                <div class="pulse-container">
                    <canvas id="canvas-shooting"></canvas>
                </div>
                <div class="pulse-container">
                    <canvas id="canvas-particles"></canvas>
                </div>
                <div class="pulse-container">
                    <canvas id="canvas-radial-bursts"></canvas>
                </div>
                <div class="pulse-container">
                    <canvas id="canvas-hyperspace"></canvas>
                </div>
            </div>
        </section>

        <!-- Key Metrics Section (from Seedwave template) -->
        <section id="metrics" class="section-padding">
            <h2 class="section-title text-light-text">Our Interstellar Impact</h2>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-card-content">
                        <div class="metric-card-icon"><i class="fas fa-globe"></i></div>
                        <h3>Global Node Reach</h3>
                        <p>Expanding our network across all digital frontiers.</p>
                        <span class="metric-value">92%</span>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-card-content">
                        <div class="metric-card-icon"><i class="fas fa-rocket"></i></div>
                        <h3>Launch Velocity</h3>
                        <p>Accelerating brands into new market orbits.</p>
                        <span class="metric-value">x10.5</span>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-card-content">
                        <div class="metric-card-icon"><i class="fas fa-seedling"></i></div>
                        <h3>Seed Planted</h3>
                        <p>New projects cultivated and thriving within the ecosystem.</p>
                        <span class="metric-value">7000+</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Master License Brands Section (from Seedwave template) -->
        <section id="master-brands" class="section-padding">
            <h2 class="section-title text-light-text">Seedwave™ Global Master License Brands</h2>
            <div class="max-w-4xl mx-auto text-lg text-gray-400 leading-relaxed space-y-4">
                <p>
                    Seedwave™ is the nexus for a diverse portfolio of Master License Brands, spanning both established digital enterprises and groundbreaking non-digital ventures. Our platform cultivates growth for innovative brands that define tomorrow's industries.
                </p>
                <p>
                    From high-velocity tech deployments infiltrating global repos to unique, tangible brands expanding their physical presence, we power the pulse of expansion across all frontiers. Explore the dynamic ecosystem where every brand is a node in our network, driving collective impact.
                </p>
            </div>
            <div class="mt-12 master-brands-grid">
                <div class="whimsical-card"> <!-- Reusing whimsical-card for styling consistency -->
                    <h3 class="text-2xl font-bold text-primary-glow-seedwave mb-4">Digital Innovators</h3>
                    <p class="text-gray-400">
                        Showcasing leading digital brands, their Node.js integrations, rapid deployments, and extensive array counts contributing to the global data fabric.
                    </p>
                    <ul class="list-disc list-inside text-gray-500 mt-4 text-sm">
                        <li>Node.js Package Infiltrations</li>
                        <li>Repo Deployment Metrics</li>
                        <li>Scalable Array Counts</li>
                        <li>Real-time Data Streams</li>
                    </ul>
                </div>
                <div class="whimsical-card"> <!-- Reusing whimsical-card for styling consistency -->
                    <h3 class="text-2xl font-bold text-secondary-glow-seedwave mb-4">Non-Digital Trailblazers</h3>
                    <p class="text-gray-400">
                        Highlighting groundbreaking non-digital brands leveraging Seedwave's infrastructure for supply chain optimization, physical asset tracking, and global market penetration.
                    </p>
                    <ul class="list-disc list-inside text-gray-500 mt-4 text-sm">
                        <li>Tangible Asset Integration</li>
                        <li>Supply Chain Optimization</li>
                        <li>Physical Network Expansion</li>
                        <li>Real-world Impact Metrics</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- Whimsical Ventures Section (from Seedwave template) -->
        <section id="whimsical-ventures" class="section-padding">
            <h2 class="section-title text-light-text">Whimsical Ventures: Noodle Soup & Job Ant Huts</h2>
            <div class="max-w-4xl mx-auto text-lg text-gray-400 leading-relaxed space-y-4">
                <p>
                    At Seedwave™, we believe in fostering innovation that spans the practical and the playfully imaginative. Our latest ventures explore the untapped potential of 'Noodle Soup Innovations' and the intricate logistics of 'Job Ant Huts', bringing delightful efficiency to unexpected places.
                </p>
                <p>
                    From optimizing the perfect noodle-to-broth ratio using quantum algorithms to managing bustling ant-colony logistics with distributed ledger technology, we're building the future, one whimsical step at a time.
                </p>
            </div>
            <div class="mt-12 whimsical-card-grid">
                <div class="whimsical-card">
                    <span class="whimsical-icon">🍜</span>
                    <h3>Noodle Soup Innovations</h3>
                    <p>
                        Crafting culinary excellence with data-driven ingredient sourcing, predictive broth temperature, and hyper-efficient noodle hydration. Experience the future of gourmet.
                    </p>
                </div>
                <div class="whimsical-card">
                    <span class="whimsical-icon">🐜🏡</span>
                    <h3>Job Ant Huts Management</h3>
                    <p>
                        Revolutionizing ant colony productivity with real-time task assignment, resource allocation, and miniature infrastructure development. Tiny workers, massive impact.
                    </p>
                </div>
                <div class="whimsical-card">
                    <span class="whimsical-icon">💡✨</span>
                    <h3>Rhino Strike Protocols</h3>
                    <p>
                        Implementing advanced behavioral algorithms for simulated rhino interactions, ensuring optimal engagement and unexpected delightful outcomes in virtual environments.
                    </p>
                </div>
            </div>
        </section>

        <!-- Key Features Section (from MindLift template) -->
        <section id="features" class="section-padding">
            <div class="container">
                <h2 class="section-title">Key Features of AgroChain™</h2>
                <div class="feature-grid">
                    <div class="feature-card">
                        <i class="fas fa-link icon"></i>
                        <h3>Direct Integration</h3>
                        <p>Direct integration with FAA 🧾 Professional Services Mes</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-sync-alt icon"></i>
                        <h3>Advanced Data Sync</h3>
                        <p>Real-time data synchronization with YieldNode™ for up-to-t</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-shield-alt icon"></i>
                        <h3>Real-time Compliance</h3>
                        <p>Ensure robust regulatory adherence with VaultLink™ (agric</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-expand-arrows-alt icon"></i>
                        <h3>Scalable Architecture</h3>
                        <p>Unleash massive scalability for x21 power expansion, ens</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-chart-line icon"></i>
                        <h3>Predictive Analytics</h3>
                        <p>Leverage our advanced predictive analytics module for Agro</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-puzzle-piece icon"></i>
                        <h3>Open API Access</h3>
                        <p>Gain full API access for seamless interoperability, allowin</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-lock icon"></i>
                        <h3>Blockchain Security</h3>
                        <p>Benefit from immutable, blockchain-secured data provenanc</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-file-invoice icon"></i>
                        <h3>One-click Reporting</h3>
                        <p>Generate comprehensive regulatory reports and detailed au</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-network-wired icon"></i>
                        <h3>Self-optimizing Nodes</h3>
                        <p>Achieve peak operational efficiency with intelligent, self</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-brain icon"></i>
                        <h3>Secure Multi-party Computation</h3>
                        <p>Enable secure, collaborative data analysis with multiple st</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Why Trust VaultMesh Section -->
        <section class="section-padding">
            <div class="container">
                <h2 class="section-title">Why Trust 🌐 VaultMesh™?</h2>
                <p class="text-lg mb-4 max-w-2xl mx-auto" style="color: var(--muted-text-dark);">
                    At <strong>VaultMesh™</strong>, we are the architects of the core infrastructure that powers the entire FAA.zone™ ecosystem. Our purpose is to provide a <strong>robust, immutable, and universally accessible fabric</strong> for critical information and distributed processes, enabling global compliance, efficiency, and innovation across heavily regulated sectors.
                </p>
                <p class="text-lg mb-4 max-w-2xl mx-auto" style="color: var(--muted-text-dark);">
                    We specialize in <strong>Decentralized Data Integrity</strong>, <strong>Secure Data Orchestration</strong>, and building <strong>Scalable & Resilient Infrastructure</strong>. Our solutions offer <strong>Verifiable Trust & Identity</strong> and comprehensive <strong>Compliance & Audit Trails</strong>.
                </p>
                <div class="text-center mt-6">
                    <p class="text-lg font-semibold" style="color: var(--text-color-dark);">Built on principles by:</p>
                    <p class="text-xl font-bold mt-1" style="color: var(--mindlift-color);">Heyns Schoeman™</p>
                    <p class="text-md" style="color: var(--muted-text-dark);">Founder | FAA Global™ | FAA.zone™ 🌍<br>"Sustain. Protect. Empower."</p>
                    <a href="vaultmesh-about-us-page.html" class="cta-button">Learn More About Us</a>
                </div>
            </div>
        </section>

        <!-- VaultMesh Subnodes Section -->
        <section class="section-padding">
            <div class="container">
                <h2 class="section-title">VaultMesh™ Subnodes</h2>
                <div class="feature-grid">
                    <div class="feature-card">
                        <i class="fas fa-seedling icon"></i>
                        <h3>YieldNode™</h3>
                        <p>Specialized nodes for optimizing agricultural yield data processing, ensuring maximum productivity and resource utilization.</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-search-location icon"></i>
                        <h3>SoilScan™</h3>
                        <p>Advanced subnode for granular soil analysis and real-time environmental data collection, enabling precision agriculture.</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-bug icon"></i>
                        <h3>PestDetect™</h3>
                        <p>Intelligent detection and tracking of agricultural pests with AI-driven insights, minimizing crop damage and chemical use.</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-barcode icon"></i>
                        <h3>CropTrace™</h3>
                        <p>Comprehensive traceability for crop origin and lifecycle management, providing transparent, farm-to-fork insights for consumers and regulators.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- FAA Metadata & Real-Time Metrics Section -->
        <section class="metadata-metrics-section section-padding">
            <div class="container">
                <h2 class="section-title">FAA Metadata & Real-Time Metrics</h2>
                <div class="metadata-metrics-grid">
                    <div class="metadata-card">
                        <h3>FAA Metadata & Compliance</h3>
                        <ul>
                            <li><strong>Product ID:</strong> AGROC-2537</li>
                            <li><strong>VaultID:</strong> VAULT-9869</li>
                            <li><strong>Signal Echo Layer:</strong> Layer Beta v4.3</li>
                            <li><strong>Deployment Zone:</strong> Zone E 8</li>
                            <li><strong>Security Rating:</strong> FAA-SEC B+</li>
                            <li><strong>Active Nodes:</strong> 493</li>
                            <li><strong>Last Audit:</strong> 2025-08-04</li>
                            <li><strong>Compliance Status:</strong> Active & Certified</li>
                        </ul>
                    </div>
                    <div class="metadata-card">
                        <h3>Real-Time Metrics Overview</h3>
                        <ul>
                            <li><strong>Current Pulse Activity:</strong> 65.08 pulses/sec</li>
                            <li><strong>Data Volume Processed (24h):</strong> 108.02 TB</li>
                            <li><strong>Latency Average:</strong> 40.82 ms</li>
                        </ul>
                        <h4 style="margin-top: 20px; font-size: 1.2rem; color: var(--text-color-dark);">VaultTrace™ Ledger Entries:</h4>
                        <ul>
                            <li>#7756 - AGROC Pulse Tx - Confirmed</li>
                            <li>#6954 - AGRIC Data Sync - Completed</li>
                            <li>#7848 - Node Activation Confirm - Offline</li>
                            <li>#3206 - VaultTrace™ Audit - Passed</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing Section (MindLift with Banimal Loop Plan) -->
        <section id="pricing" class="pricing-section section-padding">
            <div class="container">
                <h2 class="section-title">Flexible Pricing for Every Operation</h2>
                <div class="pricing-grid">
                    <div class="pricing-card">
                        <h3>🌱 Agriculture & Biotech Starter Package</h3>
                        <p class="price">$30.52</p>
                        <p class="price-description">
                            Unlock powerful features for Starter success.
                        </p>
                        <ul>
                            <li><i class="fas fa-check-circle"></i> Basic API Access</li>
                            <li><i class="fas fa-check-circle"></i> Standard Analytics Dashboard</li>
                            <li><i class="fas fa-check-circle"></i> Community Support</li>
                            <li><i class="fas fa-check-circle"></i> Up to 5 Users</li>
                            <li><i class="fas fa-check-circle"></i> 50 GB Data Storage</li>
                        </ul>
                        <div class="quantity-selector">
                            <label for="starter-quantity">Quantity:</label>
                            <select id="starter-quantity">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <div id="paypal-container-EMWGPGHNN8Y8E"></div>
                        <script>
                          paypal.HostedButtons({
                            hostedButtonId: "EMWGPGHNN8Y8E",
                          }).render("#paypal-container-EMWGPGHNN8Y8E")
                        </script>
                    </div>

                    <div class="pricing-card highlight pro-card">
                        <h3>🌱 Agriculture & Biotech Pro Package</h3>
                        <p class="price">$76.30</p>
                        <p class="price-description">
                            Unlock powerful features for Pro success.
                        </p>
                        <ul>
                            <li><i class="fas fa-check-circle"></i> Advanced API Access</li>
                            <li><i class="fas fa-check-circle"></i> Premium Analytics & Reporting</li>
                            <li><i class="fas fa-check-circle"></i> Dedicated Priority Support</li>
                            <li><i class="fas fa-check-circle"></i> Unlimited Users</li>
                            <li><i class="fas fa-check-circle"></i> Custom Data Integrations</li>
                        </ul>
                        <div class="quantity-selector">
                            <label for="pro-quantity">Quantity:</label>
                            <select id="pro-quantity">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <div id="paypal-container-QGU3ZUQCMD49Q"></div>
                        <script>
                          paypal.HostedButtons({
                            hostedButtonId: "QGU3ZUQCMD49Q",
                          }).render("#paypal-container-QGU3ZUQCMD49Q")
                        </script>
                    </div>

                    <div class="pricing-card enterprise-card">
                        <h3>🌱 Agriculture & Biotech Enterprise Package</h3>
                        <p class="price">$152.60</p>
                        <p class="price-description">
                            Unlock powerful features for Enterprise success.
                        </p>
                        <ul>
                            <li><i class="fas fa-check-circle"></i> All Business Package Features</li>
                            <li><i class="fas fa-check-circle"></i> Dedicated Account Manager</li>
                            <li><i class="fas fa-check-circle"></i> 24/7 Phone Support</li>
                            <li><i class="fas fa-check-circle"></i> Enhanced Custom Integrations</li>
                            <li><i class="fas fa-check-circle"></i> On-site Training & Setup</li>
                        </ul>
                        <div class="quantity-selector">
                            <label for="enterprise-quantity">Quantity:</label>
                            <select id="enterprise-quantity">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <div id="paypal-container-9C88S44F93M5J"></div>
                        <script>
                          paypal.HostedButtons({
                            hostedButtonId: "9C88S44F93M5J",
                          }).render("#paypal-container-9C88S44F93M5J")
                        </script>
                    </div>

                    <!-- NEW: Banimal Loop Plan -->
                    <div class="pricing-card banimal-card">
                        <h3>🐑 Banimal Loop Plan</h3>
                        <p class="price">$499.00</p>
                        <p class="price-description">
                            Drive ethical impact with advanced Banimal-specific features.
                        </p>
                        <ul>
                            <li><i class="fas fa-check-circle"></i> Global Impact Automation</li>
                            <li><i class="fas fa-check-circle"></i> Creature Data Synthesis</li>
                            <li><i class="fas fa-check-circle"></i> Baobab Network Integration</li>
                            <li><i class="fas fa-check-circle"></i> Ethical Loop Verification</li>
                            <li><i class="fas fa-check-circle"></i> Dedicated Animal Welfare Support</li>
                            <li><i class="fas fa-check-circle"></i> Unlimited Data Loops</li>
                        </ul>
                        <div class="quantity-selector">
                            <label for="banimal-quantity">Quantity:</label>
                            <select id="banimal-quantity">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <div id="paypal-container-YOUR_BANIMAL_PAYPAL_BUTTON_ID_HERE"></div>
                        <script>
                          paypal.HostedButtons({
                            hostedButtonId: "YOUR_BANIMAL_PAYPAL_BUTTON_ID_HERE", // REPLACE WITH YOUR ACTUAL PAYPAL BUTTON ID
                          }).render("#paypal-container-YOUR_BANIMAL_PAYPAL_BUTTON_ID_HERE")
                        </script>
                    </div>
                </div>
            </div>
        </section>

        <!-- Currency Converter Section -->
        <section class="currency-converter-section section-padding">
            <h2>Global Currency Converter</h2>
            <p class="text-gray-400 mb-8">Seamlessly convert between major currencies to understand your global financial reach.</p>
            <div class="currency-inputs">
                <div class="currency-input-group">
                    <label for="amount">Amount:</label>
                    <input type="number" id="amount" value="100" min="0" step="0.01">
                </div>
                <div class="currency-input-group">
                    <label for="fromCurrency">From:</label>
                    <select id="fromCurrency">
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="CHF">CHF - Swiss Franc</option>
                        <option value="CNY">CNY - Chinese Yuan</option>
                        <option value="ZAR">ZAR - South African Rand</option>
                    </select>
                </div>
                <div class="currency-input-group">
                    <label for="toCurrency">To:</label>
                    <select id="toCurrency">
                        <option value="EUR">EUR - Euro</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="CHF">CHF - Swiss Franc</option>
                        <option value="CNY">CNY - Chinese Yuan</option>
                        <option value="ZAR">ZAR - South African Rand</option>
                    </select>
                </div>
            </div>
            <button class="convert-button" id="convertCurrencyBtn">Convert</button>
            <div class="conversion-result mt-8">
                <p id="convertedResult">100 USD = ...</p>
            </div>
        </section>

        <!-- Spotify Integration Section -->
        <section id="spotify-integration" class="section-padding">
            <h2 class="section-title text-light-text">Spotify Music Pulse</h2>
            <div class="max-w-4xl mx-auto">
                <p class="text-lg text-gray-400 mb-6">
                    Connect to your Spotify account to discover your top tracks, create a new playlist, and listen to the pulse of your music.
                </p>

                <div class="spotify-controls">
                    <button id="getTopTracksBtn" class="spotify-btn spotify-btn-primary">
                        <i class="fab fa-spotify"></i> Get My Top 5 Tracks
                    </button>
                    <button id="createPlaylistBtn" class="spotify-btn spotify-btn-secondary">
                        <i class="fas fa-save"></i> Save to Playlist
                    </button>
                    <button id="playTracksBtn" class="spotify-btn spotify-btn-secondary">
                        <i class="fas fa-play-circle"></i> Listen Now
                    </button>
                </div>

                <div id="top-tracks-list" class="hidden">
                    <h3 class="text-2xl font-semibold mb-4">Your Top Tracks:</h3>
                    <ul></ul>
                </div>

                <div id="playlist-message" class="hidden mt-6 p-4 bg-green-800 bg-opacity-30 rounded-lg border border-green-700">
                    <!-- Messages about playlist creation will appear here -->
                </div>

                <div id="audio-players" class="mt-6">
                    <iframe style="border-radius:12px" src="https://open.spotify.com/embed/album/6fi2uM0hYrLOTK7jIhuAUr?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </div>

                <!-- New: Spotify Album Embed -->
                <div id="spotify-album-embed" class="mt-8">
                    <h3 class="text-2xl font-semibold mb-4 text-left">Featured Album:</h3>
                    <iframe style="border-radius:12px" src="https://open.spotify.com/embed/album/5zFzB0f8z6T2L8B5R3q2m0?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </div>

            </div>
        </section>

        <!-- Node.js Infiltration Pulse Graph Section -->
        <section id="node-pulse-graph" class="section-padding">
            <h2 class="section-title text-light-text">Node.js Infiltration Pulse</h2>
            <div class="w-full max-w-5xl mx-auto bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">
                <canvas id="nodePulseChart"></canvas>
            </div>
            <p class="text-sm text-gray-500 mt-4 max-w-2xl mx-auto">
                Real-time visualization of Node.js package infiltration, repo deployments, and array count growth across sectors.
            </p>
        </section>

        <!-- AI-Powered Help/FAQ Section -->
        <section class="section-padding ai-help-section">
            <div class="container">
                <h3 data-lang-key="ai-help-heading"><i class="fas fa-question-circle"></i>AI Help & FAQ Answers</h3>
                <p class="text-sm mb-4 text-center text-muted-text-dark" data-lang-key="ai-help-slogan">Ask your question about AgroChain™, Banimal Loop™ or FAA.zone, and our AI will answer.</p>
                <div class="form-group">
                    <label for="faqPromptInput" class="form-label" data-lang-key="your-question-label">Your Question:</label>
                    <textarea id="faqPromptInput" class="form-input" rows="4" data-lang-key="faq-placeholder" placeholder="e.g., What is the core protocol of AgroChain™?"></textarea>
                </div>
                <button id="getFaqAnswerBtn" class="checkout-action-button purple mt-4" data-lang-key="get-answer-button">Get Answer ✨</button>
                <div id="faqLoadingIndicator" class="hidden text-center mt-2 text-blue-400">
                    <i class="fas fa-spinner fa-spin mr-2"></i> <span data-lang-key="generating-answer-loading">Generating answer...</span>
                </div>
                <p id="faqAnswerOutput" class="result-text mt-4 whitespace-pre-wrap"></p>
            </div>
        </section>

        <section class="disclaimer-section">
            <div class="container">
                <p><strong>Disclaimer:</strong> This page is a static HTML demonstration. It does NOT process any real financial transactions, exchange real currency, or interact with live payment gateways or cryptocurrency networks. All displayed prices, rates, and transaction statuses are simulated for illustrative purposes only. Do NOT enter any real personal or financial information. For actual FAA.zone™ services and transactions, please refer to our official and secure platforms.</p>
            </div>
        </section>
    </main>

    <!-- Planet Pulse Text from MindLift template -->
    <p id="planet-text" class="text-center text-xl font-bold mt-8 mb-8" data-lang-key="planet-pulse-text">fruchtbarer.planet.wandel</p>

    <!-- Consolidated Footer Section -->
    <footer class="new-footer">
        <div class="banimal-footer-content text-center max-w-2xl mx-auto">
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white mb-2">
                <span data-lang-key="banimal-footer-heading">Banimal™:</span> <br>
                <span class="text-blue-400" data-lang-key="banimal-footer-slogan">🐑Kind Creatures. Global Impact.</span>
            </h1>
            <p class="text-base md:text-lg text-gray-300 leading-relaxed mb-6" data-lang-key="banimal-footer-text">Discover Banimal's world of thoughtful baby essentials & innovative lighting. For every purchase, we deliver the same item to a child in need, identified by the Baobab Security Network's data-driven insights.</p>
            <a href="global_brands.html" class="cta-button">
                Explore Banimal's World <i class="fas fa-arrow-right ml-2"></i>
            </a>
        </div>
        <p class="copyright text-sm text-gray-500 mt-8" data-lang-key="copyright-text-footer">&copy; 👟2025 Banimal™. All rights reserved.</p>
        <p class="copyright text-sm text-gray-500" data-lang-key="powered-by-text">A proud initiative of <a href="https://fruitful.faa.zone/" target="_blank" class="text-blue-400 hover:underline">Fruitful™ Treaty System™</a></p>

        <!-- Theme & Language Controls -->
        <div class="theme-controls flex items-center justify-center space-x-4 mt-4 flex-wrap gap-2">
            <button id="theme-day-btn" data-lang-key="light-mode-button">Light Mode</button>
            <button id="theme-night-btn" data-lang-key="dark-mode-button">Dark Mode</button>
            <button id="theme-hyper-btn" data-lang-key="hyper-mode-button">Hyper Mode</button>
            <select id="languageSwitcher" class="form-select">
                <!-- Options populated dynamically by JS -->
            </select>
        </div>
    </footer>

    <script type="module">
        // Object to hold all translations
        const translations = {
            en: {
                "lang-name": "English",
                "announcement-text": "🚀 Accelerate Your Workflow! Get 15% off Pro Grid for a limited time!",
                "header-slogan": "Buy one item, and we sponsor one! ❤️",
                "back-to-shop": "← Back to Shop",
                "complete-purchase": "Complete Your Purchase",
                "shipping-step": "Shipping",
                "payment-step": "Payment",
                "review-step": "Review",
                "shipping-info-heading": "Shipping Information",
                "full-name-label": "Full Name",
                "full-name-placeholder": "John Doe",
                "address-label": "Address",
                "address-placeholder": "123 Main Street",
                "city-label": "City",
                "city-placeholder": "Luxembourg City",
                "zip-code-label": "Zip Code",
                "zip-code-placeholder": "12345",
                "payment-method-heading": "Payment Method",
                "card-number-label": "Card Number",
                "month-label": "Month",
                "year-label": "Year",
                "cvv-label": "CVV",
                "order-summary-heading": "Order Summary",
                "product-item-1": "Product Item 1",
                "product-item-2": "Product Item 2",
                "shipping-cost": "Shipping",
                "total-cost": "Total",
                "ai-help-heading": "AI Help & FAQ Answers",
                "ai-help-slogan": "Ask your question about AgroChain™, Banimal Loop™ or FAA.zone, and our AI will answer.",
                "your-question-label": "Your Question:",
                "faq-placeholder": "e.g., What is the core protocol of AgroChain™?",
                "get-answer-button": "Get Answer ✨",
                "generating-answer-loading": "Generating answer...",
                "error-no-ai-answer": "Error: No answer from AI. Please try again later.",
                "reason": "Reason:",
                "error-ai-connection": "Error: Could not connect to language model. Check console for network issues.",
                "please-enter-question": "Please enter a question to get an answer.",
                "finalize-button": "Finalize & Confirm Order",
                "review-order-button": "Review Order Details",
                "planet-pulse-text": "fruchtbarer.planet.wandel",
                "banimal-footer-heading": "Banimal™:",
                "banimal-footer-slogan": "🐑Kind Creatures. Global Impact.",
                "banimal-footer-text": "Discover Banimal's world of thoughtful baby essentials & innovative lighting. For every purchase, we deliver the same item to a child in need, identified by the Baobab Security Network's data-driven insights.",
                "explore-banimal-button": "Explore Banimal's World",
                "copyright-text-footer": "&copy; 👟2025 Banimal™. All rights reserved.",
                "powered-by-text": "A proud initiative of Fruitful™ Treaty System™",
                "light-mode-button": "Light Mode",
                "dark-mode-button": "Dark Mode",
                "hyper-mode-button": "Hyper Mode"
            },
            lb: {
                "lang-name": "Lëtzebuergesch",
                "announcement-text": "🚀 Beschleunegt Äre Workflow! Kritt 15% Rabatt op Pro Grid fir eng limitéiert Zäit!",
                "header-slogan": "Kaaft keen Artikel a mir sponseren een! ❤️",
                "back-to-shop": "← Zréck an de Buttek",
                "complete-purchase": "Komplett Äre Kaf",
                "shipping-step": "Versand",
                "payment-step": "Bezuelung",
                "review-step": "Iwwerpréiwen",
                "shipping-info-heading": "Versandinformatioun",
                "full-name-label": "Voll Numm",
                "full-name-placeholder": "Max Mustermann",
                "address-label": "Adress",
                "address-placeholder": "123 Haaptstrooss",
                "city-label": "Stad",
                "city-placeholder": "Stad Lëtzebuerg",
                "zip-code-label": "Postleetzuel",
                "zip-code-placeholder": "L-1234",
                "payment-method-heading": "Bezuelmethod",
                "card-number-label": "Kaartennummer",
                "month-label": "Mount",
                "year-label": "Joer",
                "cvv-label": "CVV",
                "order-summary-heading": "Bestellungsresumé",
                "product-item-1": "Produkt Artikel 1",
                "product-item-2": "Produkt Artikel 2",
                "shipping-cost": "Versand",
                "total-cost": "Total",
                "ai-help-heading": "AI Hëllef & FAQ Äntwerten",
                "ai-help-slogan": "Stellt Är Fro iwwer AgroChain™, Banimal Loop™ oder FAA.zone, an eis KI äntwert.",
                "your-question-label": "Är Fro:",
                "faq-placeholder": "z.B. Wat ass de Kärprotokoll vun AgroChain™?",
                "get-answer-button": "Kritt Äntwert ✨",
                "generating-answer-loading": "Äntwert gëtt generéiert...",
                "error-no-ai-answer": "Feeler: Keng Äntwert vun der KI. Probéiert et w.e.g. méi spéit nach eng Kéier.",
                "reason": "Grond:",
                "error-ai-connection": "Feeler: Konnt net mat der Sproochemodell verbannen. Kuckt d'Konsol fir Netzproblemer.",
                "please-enter-question": "Gitt w.e.g. eng Fro an, fir eng Äntwert ze kréien.",
                "finalize-button": "Finaliséieren & Bestätegen Bestellung",
                "review-order-button": "Bestellungsdetailer iwwerpréiwen",
                "planet-pulse-text": "fruchtbarer.planet.wandel",
                "banimal-footer-heading": "Banimal™:",
                "banimal-footer-slogan": "🐑Kind Creatures. Global Impact.",
                "banimal-footer-text": "Entdeckt d'Welt vu Banimal's nodenkleche Baby-Essentials an innovative Beliichtung. Fir all Kaf liwwere mir deeselwechten Artikel un e Kand an Nout, identifizéiert duerch d'Date-driven Abléck vum Baobab Sécherheetsnetz.",
                "explore-banimal-button": "Entdeckt d'Welt vu Banimal",
                "copyright-text-footer": "&copy; 2025 Banimal™. All Rechter reservéiert.",
                "powered-by-text": "A proud initiative of Fruitful™ Treaty System™",
                "light-mode-button": "Liicht Modus",
                "dark-mode-button": "Däischter Modus",
                "hyper-mode-button": "Hyper Modus"
            },
            es: { // Spanish translations
                "lang-name": "Español",
                "announcement-text": "🚀 ¡Acelera tu flujo de trabajo! ¡Obtén un 15% de descuento en Pro Grid por tiempo limitado!",
                "header-slogan": "¡Compra un artículo y nosotros patrocinamos uno! ❤️",
                "back-to-shop": "← Volver a la Tienda",
                "complete-purchase": "Completar Tu Compra",
                "shipping-step": "Envío",
                "payment-step": "Pago",
                "review-step": "Revisar",
                "shipping-info-heading": "Información de Envío",
                "full-name-label": "Nombre Completo",
                "full-name-placeholder": "Juan Pérez",
                "address-label": "Dirección",
                "address-placeholder": "123 Calle Principal",
                "city-label": "Ciudad",
                "city-placeholder": "Ciudad de Luxemburgo",
                "zip-code-label": "Código Postal",
                "zip-code-placeholder": "28001",
                "payment-method-heading": "Método de Pago",
                "card-number-label": "Número de Tarjeta",
                "month-label": "Mes",
                "year-label": "Año",
                "cvv-label": "CVV",
                "order-summary-heading": "Resumen del Pedido",
                "product-item-1": "Artículo del Producto 1",
                "product-item-2": "Artículo del Producto 2",
                "shipping-cost": "Envío",
                "total-cost": "Total",
                "ai-help-heading": "Ayuda de IA y Preguntas Frecuentes",
                "ai-help-slogan": "Haz tu pregunta sobre AgroChain™, Banimal Loop™ o FAA.zone, y nuestra IA te responderá.",
                "your-question-label": "Tu Pregunta:",
                "faq-placeholder": "Ejemplo: ¿Cuál es el protocolo principal de AgroChain™?",
                "get-answer-button": "Obtener Respuesta ✨",
                "generating-answer-loading": "Generando respuesta...",
                "error-no-ai-answer": "Error: No hay respuesta de la IA. Por favor, inténtalo de nuevo más tarde.",
                "reason": "Razón:",
                "error-ai-connection": "Error: No se pudo conectar al modelo de lenguaje. Verifica la consola por problemas de red.",
                "please-enter-question": "Por favor, introduce una pregunta para obtener una respuesta.",
                "finalize-button": "Finalizar y Confirmar Pedido",
                "review-order-button": "Revisar Detalles del Pedido",
                "planet-pulse-text": "fruchtbarer.planet.wandel",
                "banimal-footer-heading": "Banimal™:",
                "banimal-footer-slogan": "🐑Criaturas Amables. Impacto Global.",
                "banimal-footer-text": "Descubre el mundo de Banimal de artículos esenciales para bebés y soluciones de iluminación innovadoras. Por cada compra, entregamos el mismo artículo a un niño necesitado, identificado por los datos de la Red de Seguridad Baobab.",
                "explore-banimal-button": "Explorar el Mundo de Banimal",
                "copyright-text-footer": "&copy; 👟2025 Banimal™. Todos los derechos reservados.",
                "powered-by-text": "Una orgullosa iniciativa de Fruitful™ Treaty System™",
                "light-mode-button": "Light Mode",
                "dark-mode-button": "Dark Mode",
                "hyper-mode-button": "Hyper Mode"
            },
            fr: { // French translations
                "lang-name": "Français",
                "announcement-text": "🚀 Accélérez votre flux de travail ! Obtenez 15% de réduction sur Pro Grid para un temps limité !",
                "header-slogan": "Achetez un article, et nous en parrainons un ! ❤️",
                "back-to-shop": "← Retour à la Boutique",
                "complete-purchase": "Finaliser Votre Achat",
                "shipping-step": "Expédition",
                "payment-step": "Paiement",
                "review-step": "Vérifier",
                "shipping-info-heading": "Informations de Livraison",
                "full-name-label": "Nom Complet",
                "full-name-placeholder": "Jean Dupont",
                "address-label": "Adresse",
                "address-placeholder": "123 Rue Principale",
                "city-label": "Ville",
                "city-placeholder": "Ville de Luxembourg",
                "zip-code-label": "Code Postal",
                "zip-code-placeholder": "L-1111",
                "payment-method-heading": "Méthode de Paiement",
                "card-number-label": "Numéro de Carte",
                "month-label": "Mois",
                "year-label": "Année",
                "cvv-label": "CVV",
                "order-summary-heading": "Récapitulatif de Commande",
                "product-item-1": "Article Produit 1",
                "product-item-2": "Article Produit 2",
                "shipping-cost": "Livraison",
                "total-cost": "Total",
                "ai-help-heading": "Aide IA & Réponses FAQ",
                "ai-help-slogan": "Posez votre question sur AgroChain™, Banimal Loop™ ou FAA.zone, et notre IA vous répondra.",
                "your-question-label": "Votre Question :",
                "faq-placeholder": "Ex: Quel est le protocole de base d'AgroChain™ ?",
                "get-answer-button": "Obtenir la Réponse ✨",
                "generating-answer-loading": "Génération de la réponse...",
                "error-no-ai-answer": "Erreur : Pas de réponse de l'IA. Veuillez réessayer plus tard.",
                "reason": "Raison :",
                "error-ai-connection": "Erreur : Impossible de se connecter au modèle de langage. Vérifiez la console pour les problèmes de réseau.",
                "please-enter-question": "Veuillez saisir une question pour obtenir une réponse.",
                "finalize-button": "Finaliser et Confirmer la Commande",
                "review-order-button": "Vérifier les Détails de la Commande",
                "planet-pulse-text": "fruchtbarer.planet.wandel",
                "banimal-footer-heading": "Banimal™ :",
                "banimal-footer-slogan": "🐑Créatures Douces. Impact Mondial.",
                "banimal-footer-text": "Découvrez le monde de Banimal : des essentiels pour bébés et des solutions d'éclairage innovantes. Pour chaque achat, nous livrons le même article à un enfant dans le besoin, identifié grâce aux données du Réseau de Sécurité Baobab.",
                "explore-banimal-button": "Explorer le Monde de Banimal",
                "copyright-text-footer": "&copy; 👟2025 Banimal™. Tous droits réservés.",
                "powered-by-text": "Une fière initiative de Fruitful™ Treaty System™",
                "light-mode-button": "Light Mode",
                "dark-mode-button": "Dark Mode",
                "hyper-mode-button": "Hyper Mode"
            },
            de: { // German translations
                "lang-name": "Deutsch",
                "announcement-text": "🚀 Beschleunigen Sie Ihren Workflow! Erhalten Sie 15% Rabatt auf Pro Grid für begrenzte Zeit!",
                "header-slogan": "Kaufen Sie einen Artikel, und wir sponsern einen! ❤️",
                "back-to-shop": "← Zurück zum Shop",
                "complete-purchase": "Kauf abschließen",
                "shipping-step": "Versand",
                "payment-step": "Zahlung",
                "review-step": "Überprüfung",
                "shipping-info-heading": "Versandinformationen",
                "full-name-label": "Vollständiger Name",
                "full-name-placeholder": "Max Mustermann",
                "address-label": "Adresse",
                "address-placeholder": "Musterstraße 123",
                "city-label": "Stadt",
                "city-placeholder": "Luxemburg-Stadt",
                "zip-code-label": "Postleitzahl",
                "zip-code-placeholder": "12345",
                "payment-method-heading": "Zahlungsmethode",
                "card-number-label": "Kartennummer",
                "month-label": "Monat",
                "year-label": "Jahr",
                "cvv-label": "CVV",
                "order-summary-heading": "Bestellübersicht",
                "product-item-1": "Produktartikel 1",
                "product-item-2": "Produktartikel 2",
                "shipping-cost": "Versand",
                "total-cost": "Gesamt",
                "ai-help-heading": "KI-Hilfe & FAQ-Antworten",
                "ai-help-slogan": "Stellen Sie Ihre Frage zu AgroChain™, Banimal Loop™ oder FAA.zone, und unsere KI wird antworten.",
                "your-question-label": "Ihre Frage:",
                "faq-placeholder": "z.B. Was ist das Kernprotokoll von AgroChain™?",
                "get-answer-button": "Antwort erhalten ✨",
                "generating-answer-loading": "Antwort wird generiert...",
                "error-no-ai-answer": "Fehler: Keine Antwort von der KI. Bitte versuchen Sie es später noch einmal.",
                "reason": "Grund:",
                "error-ai-connection": "Fehler: Verbindung zum Sprachmodell konnte nicht hergestellt werden. Überprüfen Sie die Konsole auf Netzwerkprobleme.",
                "please-enter-question": "Bitte geben Sie eine Frage ein, um eine Antwort zu erhalten.",
                "finalize-button": "Bestellung abschließen & bestätigen",
                "review-order-button": "Bestelldetails überprüfen",
                "planet-pulse-text": "fruchtbarer.planet.wandel",
                "banimal-footer-heading": "Banimal™:",
                "banimal-footer-slogan": "🐑Freundliche Kreaturen. Globaler Einfluss.",
                "banimal-footer-text": "Entdecken Sie Banimals Welt der durchdachten Babyartikel und innovativen Beleuchtung. Für jeden Kauf liefern wir den gleichen Artikel an ein bedürftiges Kind, identifiziert durch die datengestützten Erkenntnisse des Baobab Sicherheitsnetzwerks.",
                "explore-banimal-button": "Entdecken Sie Banimals Welt",
                "copyright-text-footer": "&copy; 👟2025 Banimal™. Alle Rechte vorbehalten.",
                "powered-by-text": "Eine stolze Initiative von Fruitful™ Treaty System™",
                "light-mode-button": "Light Mode",
                "dark-mode-button": "Dark Mode",
                "hyper-mode-button": "Hyper Mode"
            },
            zh: { // Chinese Simplified translations
                "lang-name": "简体中文",
                "announcement-text": "🚀 加速您的工作流程！限时享受 Pro Grid 15% 折扣！",
                "header-slogan": "买一件，我们赞助一件！❤️",
                "back-to-shop": "← 返回商店",
                "complete-purchase": "完成您的购买",
                "shipping-step": "配送",
                "payment-step": "支付",
                "review-step": "审查",
                "shipping-info-heading": "配送信息",
                "full-name-label": "全名",
                "full-name-placeholder": "张三",
                "address-label": "地址",
                "address-placeholder": "主街123号",
                "city-label": "城市",
                "city-placeholder": "卢森堡市",
                "zip-code-label": "邮政编码",
                "zip-code-placeholder": "100000",
                "payment-method-heading": "支付方式",
                "card-number-label": "卡号",
                "month-label": "月",
                "year-label": "年",
                "cvv-label": "CVV",
                "order-summary-heading": "订单摘要",
                "product-item-1": "商品1",
                "product-item-2": "商品2",
                "shipping-cost": "运费",
                "total-cost": "总计",
                "ai-help-heading": "AI 帮助和常见问题解答",
                "ai-help-slogan": "提出您关于 AgroChain™、Banimal Loop™ 或 FAA.zone 的问题，我们的 AI 将为您解答。",
                "your-question-label": "您的问题：",
                "faq-placeholder": "例如：AgroChain™ 的核心协议是什么？",
                "get-answer-button": "获取答案 ✨",
                "generating-answer-loading": "正在生成答案...",
                "error-no-ai-answer": "错误：AI 没有返回答案。请稍后再试。",
                "reason": "原因：",
                "error-ai-connection": "错误：无法连接到语言模型。请检查控制台以查看网络问题。",
                "please-enter-question": "请输入问题以获取答案。",
                "finalize-button": "完成并确认订单",
                "review-order-button": "查看订单详情",
                "planet-pulse-text": "fruchtbarer.planet.wandel",
                "banimal-footer-heading": "Banimal™：",
                "banimal-footer-slogan": "🐑善良生物。全球影响。",
                "banimal-footer-text": "探索 Banimal 的世界：周到的婴儿必需品和创新的照明产品。每次购买，我们都会将相同的物品捐赠给巴奥巴安全网络数据洞察识别出的有需要的儿童。",
                "explore-banimal-button": "探索 Banimal 的世界",
                "copyright-text-footer": "&copy; 👟2025 Banimal™。保留所有权利。",
                "powered-by-text": "Fruitful™ Treaty System™ 的一项自豪倡议",
                "light-mode-button": "Light Mode",
                "dark-mode-button": "Dark Mode",
                "hyper-mode-button": "Hyper Mode"
            },
            hi: { // Hindi translations
                "lang-name": "हिंदी",
                "announcement-text": "🚀 अपने वर्कफ़्लो को तेज़ करें! सीमित समय के लिए प्रो ग्रिड पर 15% की छूट पाएं!",
                "header-slogan": "एक आइटम खरीदें, और हम एक को प्रायोजित करते हैं! ❤️",
                "back-to-shop": "← दुकान पर वापस",
                "complete-purchase": "अपनी खरीद पूरी करें",
                "shipping-step": "शिपिंग",
                "payment-step": "भुगतान",
                "review-step": "समीक्षा",
                "shipping-info-heading": "शिपिंग जानकारी",
                "full-name-label": "पूरा नाम",
                "full-name-placeholder": "जॉन डो",
                "address-label": "पता",
                "address-placeholder": "123 मुख्य सड़क",
                "city-label": "शहर",
                "city-placeholder": "लक्ज़मबर्ग शहर",
                "zip-code-label": "ज़िप कोड",
                "zip-code-placeholder": "110001",
                "payment-method-heading": "भुगतान विधि",
                "card-number-label": "कार्ड नंबर",
                "month-label": "महीना",
                "year-label": "साल",
                "cvv-label": "CVV",
                "order-summary-heading": "आर्डर सारांश",
                "product-item-1": "उत्पाद आइटम 1",
                "product-item-2": "उत्पाद आइटम 2",
                "shipping-cost": "शिपिंग",
                "total-cost": "कुल",
                "ai-help-heading": "एआई मदद और अक्सर पूछे जाने वाले प्रश्न",
                "ai-help-slogan": "AgroChain™, Banimal Loop™ या FAA.zone के बारे में अपना प्रश्न पूछें, और हमारी एआई जवाब देगी।",
                "your-question-label": "आपका प्रश्न:",
                "faq-placeholder": "उदाहरण के लिए, AgroChain™ का मुख्य प्रोटोकॉल क्या है?",
                "get-answer-button": "उत्तर प्राप्त करें ✨",
                "generating-answer-loading": "उत्तर उत्पन्न हो रहा है...",
                "error-no-ai-answer": "त्रुटि: एआई से कोई जवाब नहीं। कृपया बाद में पुनः प्रयास करें।",
                "reason": "कारण:",
                "error-ai-connection": "त्रुटि: भाषा मॉडल से कनेक्ट नहीं हो सका। नेटवर्क समस्याओं के लिए कंसोल जांचें।",
                "please-enter-question": "कृपया उत्तर प्राप्त करने के लिए एक प्रश्न दर्ज करें।",
                "finalize-button": "ऑर्डर को अंतिम रूप दें और पुष्टि करें",
                "review-order-button": "ऑर्डर विवरण की समीक्षा करें",
                "planet-pulse-text": "fruchtbarer.planet.wandel",
                "banimal-footer-heading": "Banimal™:",
                "banimal-footer-slogan": "🐑दयालु जीव। वैश्विक प्रभाव।",
                "banimal-footer-text": "विचारशील शिशु आवश्यक वस्तुओं और अभिनव प्रकाश व्यवस्था की Banimal दुनिया की खोज करें। प्रत्येक खरीद के लिए, हम बाओबाब सुरक्षा नेटवर्क के डेटा-संचालित अंतर्दृष्टि द्वारा पहचाने गए जरूरतमंद बच्चे को वही आइटम वितरित करते हैं।",
                "explore-banimal-button": "Banimal की दुनिया का अन्वेषण करें",
                "copyright-text-footer": "&copy; 👟2025 Banimal™. सभी अधिकार सुरक्षित।",
                "powered-by-text": "फ्रूटफुल™ ट्रीटी सिस्टम™ की एक गर्वपूर्ण पहल",
                "light-mode-button": "Light Mode",
                "dark-mode-button": "Dark Mode",
                "hyper-mode-button": "Hyper Mode"
            },
            ar: { // Arabic translations
                "lang-name": "العربية",
                "announcement-text": "🚀 سارع بتحسين سير عملك! احصل على خصم 15% على برو جريد لفترة محدودة!",
                "header-slogan": "اشترِ منتجًا واحدًا، ونحن نرعى واحدًا! ❤️",
                "back-to-shop": "← العودة إلى المتجر",
                "complete-purchase": "إتمام عملية الشراء",
                "shipping-step": "الشحن",
                "payment-step": "الدفع",
                "review-step": "المراجعة",
                "shipping-info-heading": "معلومات الشحن",
                "full-name-label": "الاسم الكامل",
                "full-name-placeholder": "محمد علي",
                "address-label": "العنوان",
                "address-placeholder": "123 الشارع الرئيسي",
                "city-label": "المدينة",
                "city-placeholder": "مدينة لوكسمبورغ",
                "zip-code-label": "الرمز البريدي",
                "zip-code-placeholder": "10000",
                "payment-method-heading": "طريقة الدفع",
                "card-number-label": "رقم البطاقة",
                "month-label": "الشهر",
                "year-label": "السنة",
                "cvv-label": "CVV",
                "order-summary-heading": "ملخص الطلب",
                "product-item-1": "المنتج 1",
                "product-item-2": "المنتج 2",
                "shipping-cost": "الشحن",
                "total-cost": "الإجمالي",
                "ai-help-heading": "مساعدة الذكاء الاصطناعي والإجابات الشائعة",
                "ai-help-slogan": "اطرح سؤالك حول AgroChain™، Banimal Loop™ أو FAA.zone، وسيقوم الذكاء الاصطناعي لدينا بالإجابة.",
                "your-question-label": "سؤالك:",
                "faq-placeholder": "مثال: ما هو البروتوكول الأساسي لـ AgroChain™؟",
                "get-answer-button": "احصل على الإجابة ✨",
                "generating-answer-loading": "جارٍ إنشاء الإجابة...",
                "error-no-ai-answer": "خطأ: لا توجد إجابة من الذكاء الاصطناعي. يرجى المحاولة مرة أخرى لاحقًا.",
                "reason": "السبب:",
                "error-ai-connection": "خطأ: لم يتمكن من الاتصال بنموذج اللغة. تحقق من وحدة التحكم لمشاكل الشبكة.",
                "please-enter-question": "الرجاء إدخال سؤال للحصول على إجابة.",
                "finalize-button": "إنهاء وتأكيد الطلب",
                "review-order-button": "مراجعة تفاصيل الطلب",
                "planet-pulse-text": "fruchtbarer.planet.wandel",
                "banimal-footer-heading": "Banimal™:",
                "banimal-footer-slogan": "🐑مخلوقات طيبة. تأثير عالمي.",
                "banimal-footer-text": "اكتشف عالم Banimal من أساسيات الأطفال المدروسة وحلول الإضاءة المبتكرة. مقابل كل عملية شراء، نقدم نفس العنصر لطفل محتاج، يتم تحديده من خلال رؤى شبكة أمان الباوباب المستندة إلى البيانات.",
                "explore-banimal-button": "استكشف عالم Banimal",
                "copyright-text-footer": "&copy; 👟2025 Banimal™. جميع الحقوق محفوظة.",
                "powered-by-text": "مبادرة فخرية من Fruitful™ Treaty System™"
            }
        };

        // Global setLanguage function (moved to global scope)
        function setLanguage(lang) {
            document.body.lang = lang;
            localStorage.setItem('selectedLanguage', lang);

            document.querySelectorAll('[data-lang-key]').forEach(element => {
                const key = element.getAttribute('data-lang-key');
                const translation = translations[lang] && translations[lang][key] !== undefined
                    ? translations[lang][key]
                    : (translations['en'] && translations['en'][key] !== undefined ? translations['en'][key] : undefined);

                if (translation !== undefined) {
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = translation;
                    } else if (key === "explore-banimal-button" || key === "get-answer-button") {
                        const iconHtml = element.innerHTML.match(/<i class=".*"><\/i>/);
                        element.innerHTML = translation + (iconHtml ? ' ' + iconHtml[0] : '');
                    } else if (key === "ai-help-heading") {
                        const iconHtml = element.innerHTML.match(/<i class=".*"><\/i>/);
                        element.innerHTML = (iconHtml ? iconHtml[0] + ' ' : '') + translation;
                    } else if (key === "light-mode-button" || key === "dark-mode-button" || key === "hyper-mode-button" || key === "lang-name") {
                        element.textContent = translation;
                    } else {
                        element.textContent = translation;
                    }
                } else {
                    console.warn(\`Missing translation for key '${key}' in language '${lang}'. Falling back to English if available.\`);
                }
            });

            // Update AI response area messages (specific logic to re-translate errors/prompts)
            const faqAnswerOutput = document.getElementById('faqAnswerOutput');
            const faqPromptInput = document.getElementById('faqPromptInput');
            if (faqAnswerOutput && faqPromptInput) {
                // If the current message is a known English error/prompt, translate it
                if (faqAnswerOutput.textContent === translations['en']['please-enter-question']) {
                    faqAnswerOutput.textContent = translations[lang]['please-enter-question'];
                } else if (faqAnswerOutput.textContent.startsWith(translations['en']['error-no-ai-answer'])) {
                    const englishErrorMessage = faqAnswerOutput.textContent;
                    const englishReasonMatch = englishErrorMessage.match(new RegExp(\`${translations['en']['reason']}\\s*(.*)\`));
                    const englishReason = englishReasonMatch ? englishReasonMatch[1] : '';

                    let translatedMessage = translations[lang]['error-no-ai-answer'];
                    if (englishReason) {
                        translatedMessage += \` ${translations[lang]['reason']} ${englishReason}\`;
                    }
                    faqAnswerOutput.textContent = translatedMessage;
                } else if (faqAnswerOutput.textContent.startsWith(translations['en']['error-ai-connection'])) {
                    faqAnswerOutput.textContent = translations[lang]['error-ai-connection'];
                }
            }
        }


        // Canvas animation objects (from Seedwave template)
        const canvases = {
            rhythmic: { canvas: null, ctx: null, time: 0, animationId: null },
            concentric: { canvas: null, ctx: null, time: 0, animationId: null },
            shooting: { canvas: null, ctx: null, time: 0, animationId: null, pulses: [] },
            particles: { canvas: null, ctx: null, time: 0, animationId: null, particles: [] },
            radialBursts: { canvas: null, ctx: null, time: 0, animationId: null, bursts: [] },
            hyperspace: { canvas: null, ctx: null, time: 0, animationId: null }
        };

        const headerPulse = {
            canvas: null,
            ctx: null,
            time: 0,
            animationId: null,
            data: [],
            maxDataPoints: 50,
            valueRange: 100,
            speed: 0.8
        };

        // Helper to initialize and resize a canvas
        function setupCanvas(canvasId, obj) {
            obj.canvas = document.getElementById(canvasId);
            if (obj.canvas) {
                obj.ctx = obj.canvas.getContext('2d');
                // console.log(\`Canvas ${canvasId} found. Context:\`, obj.ctx); // Debugging line
                if (obj.ctx) {
                    resizeCanvasElement(obj.canvas);
                    // console.log(\`Canvas ${canvasId} resized to: ${obj.canvas.width}x${obj.canvas.height}\`); // Debugging line
                    if (obj.canvas.width === 0 || obj.canvas.height === 0) {
                        console.warn(\`Canvas ${canvasId} has zero dimensions initially. This might affect rendering.\`);
                    }
                } else {
                    console.error(\`Could not get 2D context for canvas ${canvasId}.\`);
                }
            } else {
                console.error(\`Canvas element with ID "${canvasId}" not found in the DOM.\`);
            }
        }

        // Helper to resize a single canvas element
        function resizeCanvasElement(canvas) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        // Resize all canvases
        function resizeAllCanvases() {
            if (headerPulse.canvas) {
                resizeCanvasElement(headerPulse.canvas);
            }
            for (const key in canvases) {
                if (canvases[key].canvas) {
                    resizeCanvasElement(canvases[key].canvas);
                }
            }
            // Re-render node pulse chart on resize
            if (nodePulseChartInstance) {
                nodePulseChartInstance.resize();
            }
        }

        // --- Header "Stock Exchange Pulse" Animation ---
        function drawHeaderPulse() {
            const { canvas, ctx, data, maxDataPoints, valueRange } = headerPulse;
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(10, 10, 13, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const lastValue = data.length > 0 ? data[data.length - 1] : valueRange / 2;
            let newValue = lastValue + (Math.random() - 0.5) * 10;
            newValue = Math.max(5, Math.min(valueRange - 5, newValue));
            data.push(newValue);

            if (data.length > maxDataPoints) {
                data.shift();
            }

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 227, 147, 0.9)';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(0, 227, 147, 0.7)';

            const pointWidth = canvas.width / (maxDataPoints - 1);
            for (let i = 0; i < data.length; i++) {
                const x = i * pointWidth;
                const y = canvas.height - (data[i] / valueRange) * canvas.height;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            ctx.shadowBlur = 0;

            headerPulse.animationId = requestAnimationFrame(drawHeaderPulse);
        }

        function startHeaderPulseAnimation() {
            for(let i = 0; i < headerPulse.maxDataPoints; i++) {
                headerPulse.data.push(Math.random() * headerPulse.valueRange);
            }
            drawHeaderPulse();
        }

        // --- Pulse Animation Classes & Functions (for Hero Grid) ---
        function drawRhythmicPulse(canvasObj) {
            const { canvas, ctx } = canvasObj;
            if (!ctx) return;
            ctx.fillStyle = 'rgba(10, 10, 13, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const numRhythmicLines = 40;
            const rhythmicLineAmplitude = canvas.height / 2.5;
            const rhythmicLineFrequency = 0.1;
            const rhythmicLineSpeed = 0.015;
            canvasObj.time += rhythmicLineSpeed;
            for (let i = 0; i < numRhythmicLines; i++) {
                ctx.beginPath();
                const offset = i * (Math.PI * 2 / numRhythmicLines);
                const colorHue = (canvasObj.time * 200 + i * 15) % 360;
                ctx.strokeStyle = \`hsla(${colorHue}, 95%, 75%, 0.9)\`;
                ctx.lineWidth = 2.5;
                for (let x = 0; x < canvas.width; x += 2) {
                    const y = Math.sin(x * rhythmicLineFrequency + canvasObj.time + offset) * (rhythmicLineAmplitude * (Math.sin(canvasObj.time * 0.3 + i * 0.15) * 0.5 + 0.5)) + canvas.height / 2;
                    if (x === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
                }
                ctx.stroke();
            }
            canvasObj.animationId = requestAnimationFrame(() => drawRhythmicPulse(canvasObj));
        }

        function drawConcentricWaves(canvasObj) {
            const { canvas, ctx } = canvasObj;
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(10, 10, 13, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const numWaves = 20;
            const waveSpeed = 0.02;
            const waveThickness = 4;
            const waveSpacing = 12;
            canvasObj.time += waveSpeed;
            for (let i = 0; i < numWaves; i++) {
                ctx.beginPath();
                const radius = (canvasObj.time * waveSpacing + i * waveSpacing) % (Math.max(canvas.width, canvas.height) / 1.2) + 5;
                const hue = (i * 20 + canvasObj.time * 100) % 360;
                ctx.strokeStyle = \`hsla(${hue}, 95%, 80%, ${0.95 - (radius / (Math.max(canvas.width, canvas.height) / 1.2))})\`;
                ctx.lineWidth = waveThickness;
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
                if (i < 7) {
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius * 0.25, 0, Math.PI * 2);
                    ctx.fillStyle = \`hsla(${hue + 70}, 100%, 85%, ${0.6 - (radius / (Math.max(canvas.width, canvas.height) / 1.2)) * 0.6})\`;
                    ctx.fill();
                }
            }
            const coreRadius = 20 + Math.sin(canvasObj.time * 10) * 8;
            ctx.beginPath();
            ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
            ctx.fillStyle = \`rgba(0, 227, 147, ${0.95 + Math.sin(canvasObj.time * 10) * 0.05})\`;
            ctx.shadowBlur = 30;
            ctx.shadowColor = 'rgba(0, 227, 147, 1.0)';
            ctx.fill();
            ctx.shadowBlur = 0;
            canvasObj.animationId = requestAnimationFrame(() => drawConcentricWaves(canvasObj));
        }

        class ShootingPulse {
            constructor(canvas) {
                this.canvas = canvas;
                this.x = Math.random() * this.canvas.width;
                this.y = Math.random() * this.canvas.height;
                this.initialRadius = 1;
                this.currentRadius = this.initialRadius;
                this.maxRadius = Math.random() * 150 + 80;
                this.speed = Math.random() * 4 + 2;
                this.alpha = 1;
                this.decayRate = Math.random() * 0.012 + 0.006;
                this.color = \`hsl(${Math.random() * 360}, 100%, 80%)\`;
                this.numRings = Math.floor(Math.random() * 6) + 5;
                this.glowStrength = Math.random() * 25 + 15;
            }
            update() {
                this.currentRadius += this.speed;
                this.alpha -= this.decayRate;
                return this.alpha > 0 && this.currentRadius < this.maxRadius;
            }
            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2.5;
                for (let i = 0; i < this.numRings; i++) {
                    const ringRadius = this.currentRadius - (i * (this.currentRadius / this.numRings));
                    if (ringRadius > this.initialRadius) {
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, ringRadius, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.initialRadius * 3, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = this.glowStrength;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.restore();
            }
        }

        function drawShootingPulses(canvasObj) {
            const { canvas, ctx, pulses } = canvasObj;
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(10, 10, 13, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const shootingPulseSpawnRate = 0.3;
            const maxShootingPulses = 50;
            if (Math.random() < shootingPulseSpawnRate && pulses.length < maxShootingPulses) {
                pulses.push(new ShootingPulse(canvas));
            }
            for (let i = pulses.length - 1; i >= 0; i--) {
                const pulse = pulses[i];
                if (pulse.update()) {
                    pulse.draw(ctx);
                } else {
                    pulses.splice(i, 1);
                }
            }
            canvasObj.animationId = requestAnimationFrame(() => drawShootingPulses(canvasObj));
        }

        class Particle {
            constructor(canvas) {
                this.canvas = canvas;
                this.x = Math.random() * this.canvas.width;
                this.y = Math.random() * this.canvas.height;
                this.size = Math.random() * 2.5 + 1.5;
                this.speedX = (Math.random() * 2 - 1);
                this.speedY = (Math.random() * 2 - 1);
                this.color = \`hsl(${Math.random() * 360}, 100%, 80%)\`;
                this.alpha = 1;
                this.decay = 0.002;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.alpha -= this.decay;
                if (this.alpha < 0 || this.x < -20 || this.x > this.canvas.width + 20 || this.y < -20 || this.y > this.canvas.height + 20) {
                    this.alpha = 1;
                    this.x = Math.random() * this.canvas.width;
                    this.y = Math.random() * this.canvas.height;
                    this.speedX = (Math.random() * 2 - 1);
                    this.speedY = (Math.random() * 2 - 1);
                }
            }
            draw(ctx) {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function drawParticlesWithConnections(canvasObj) {
            const { canvas, ctx, particles } = canvasObj;
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(10, 10, 13, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (particles.length === 0) {
                for (let i = 0; i < 150; i++) {
                    particles.push(new Particle(canvas));
                }
            }
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw(ctx);
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = \`rgba(0, 123, 255, ${particles[i].alpha * particles[j].alpha * (1 - (distance / 120)) * 1.0})\`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;
            canvasObj.animationId = requestAnimationFrame(() => drawParticlesWithConnections(canvasObj));
        }

        class RadialBurst {
            constructor(canvas) {
                this.canvas = canvas;
                this.x = Math.random() * this.canvas.width;
                this.y = Math.random() * this.canvas.height;
                this.radius = 0;
                this.maxRadius = Math.random() * 200 + 100;
                this.speed = Math.random() * 5 + 3;
                this.alpha = 1;
                this.decay = Math.random() * 0.01 + 0.005;
                this.numLines = Math.floor(Math.random() * 20) + 15;
                this.color = \`hsl(${Math.random() * 360}, 100%, 80%)\`;
            }
            update() {
                this.radius += this.speed;
                this.alpha -= this.decay;
                return this.alpha > 0;
            }
            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                for (let i = 0; i < this.numLines; i++) {
                    const angle = (Math.PI * 2 / this.numLines) * i;
                    const startX = this.x + Math.cos(angle) * this.radius * 0.1;
                    const startY = this.y + Math.sin(angle) * this.radius * 0.1;
                    const endX = this.x + Math.cos(angle) * this.radius;
                    const endY = this.y + Math.sin(angle) * this.radius;
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                }
                ctx.restore();
            }
        }

        function drawRadialBursts(canvasObj) {
            const { canvas, ctx, bursts } = canvasObj;
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(10, 10, 13, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const burstSpawnRate = 0.12;
            const maxBursts = 20;
            if (Math.random() < burstSpawnRate && bursts.length < maxBursts) {
                bursts.push(new RadialBurst(canvas));
            }
            for (let i = bursts.length - 1; i >= 0; i--) {
                const burst = bursts[i];
                if (burst.update()) {
                    burst.draw(ctx);
                } else {
                    bursts.splice(i, 1);
                }
            }
            canvasObj.animationId = requestAnimationFrame(() => drawRadialBursts(canvasObj));
        }

        function drawHyperspaceWarp(canvasObj) {
            const { canvas, ctx } = canvasObj;
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(10, 10, 13, 0.18)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            canvasObj.time += 0.06;
            const gridSpacing = 25;
            const lineCountX = Math.ceil(canvas.width / gridSpacing);
            const lineCountY = Math.ceil(canvas.height / gridSpacing);
            const colorProgress = (Math.sin(canvasObj.time * 0.8) + 1) / 2;
            const r = Math.floor(0 + colorProgress * (0 - 0));
            const g = Math.floor(123 + colorProgress * (227 - 123));
            const b = Math.floor(255 + colorProgress * (147 - 255));
            ctx.strokeStyle = \`rgba(${r}, ${g}, ${b}, ${0.7 + colorProgress * 0.3})\`;
            ctx.lineWidth = 1.5;
            for (let i = 0; i <= lineCountY; i++) {
                const y = i * gridSpacing;
                ctx.beginPath();
                ctx.moveTo(0, y + Math.sin(canvasObj.time + y * 0.03) * 20);
                ctx.lineTo(canvas.width, y + Math.sin(canvasObj.time + y * 0.03) * 20);
                ctx.stroke();
            }
            for (let i = 0; i <= lineCountX; i++) {
                const x = i * gridSpacing;
                ctx.beginPath();
                ctx.moveTo(x + Math.cos(canvasObj.time + x * 0.03) * 20, 0);
                ctx.lineTo(x + Math.cos(canvasObj.time + x * 0.03) * 20, canvas.height);
                ctx.stroke();
            }
            canvasObj.animationId = requestAnimationFrame(() => drawHyperspaceWarp(canvasObj));
        }

        // Function to start the animation for a specific canvas (hero grid)
        function startCanvasAnimation(key) {
            const canvasObj = canvases[key];
            if (!canvasObj.ctx) {
                console.warn(\`Cannot start animation for ${key}: context is null.\`);
                return;
            }
            if (canvasObj.animationId) {
                cancelAnimationFrame(canvasObj.animationId);
            }
            switch (key) {
                case 'rhythmic': drawRhythmicPulse(canvasObj); break;
                case 'concentric': drawConcentricWaves(canvasObj); break;
                case 'shooting': drawShootingPulses(canvasObj); break;
                case 'particles':
                    if (canvasObj.particles.length === 0) {
                        for (let i = 0; i < 150; i++) { canvasObj.particles.push(new Particle(canvasObj.canvas)); }
                    }
                    drawParticlesWithConnections(canvasObj);
                    break;
                case 'radialBursts': drawRadialBursts(canvasObj); break;
                case 'hyperspace': drawHyperspaceWarp(canvasObj); break;
            }
            // console.log(\`Animation started for: ${key}\`); // Debugging line
        }

        // Chart.js for Node Pulse Graph
        let nodePulseChartInstance = null;
        function renderNodePulseChart() {
            const ctx = document.getElementById('nodePulseChart')?.getContext('2d');
            if (!ctx) {
                // console.warn("Node Pulse Chart canvas or context not found."); // Debugging line
                return;
            }

            if (nodePulseChartInstance) {
                nodePulseChartInstance.destroy();
            }

            const dataPoints = 50;
            const labels = Array.from({length: dataPoints}, (_, i) => \`Tick ${i+1}\`);
            const coreNodeData = Array.from({length: dataPoints}, (v, i) => Math.floor(Math.max(0, 50 + (i * 1.5) + (Math.random() - 0.5) * 40)));
            const arrayCountData = Array.from({length: dataPoints}, (v, i) => Math.floor(Math.max(0, 100 + (i * 2) + (Math.random() - 0.5) * 60)));
            const repoInfiltrationData = Array.from({length: dataPoints}, (v, i) => Math.floor(Math.max(0, 10 + (i * 0.8) + (Math.random() - 0.5) * 20)));

            nodePulseChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        { label: 'Core Nodes (Thousands)', data: coreNodeData, borderColor: 'rgba(0, 227, 147, 0.9)', backgroundColor: 'rgba(0, 227, 147, 0.1)', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2 },
                        { label: 'Array Counts (Hundreds)', data: arrayCountData, borderColor: 'rgba(0, 123, 255, 0.9)', backgroundColor: 'rgba(0, 123, 255, 0.1)', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2 },
                        { label: 'Repo Infiltrations', data: repoInfiltrationData, borderColor: 'rgba(255, 77, 77, 0.9)', backgroundColor: 'rgba(255, 77, 77, 0.1)', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 0 },
                    scales: {
                        x: { display: false },
                        y: {
                            beginAtZero: true,
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    },
                    plugins: {
                        legend: { labels: { color: 'rgba(255, 255, 255, 0.9)' } }
                    }
                }
            });

            setInterval(() => {
                if (!nodePulseChartInstance) return; // Ensure instance still exists
                const lastCore = nodePulseChartInstance.data.datasets[0].data[nodePulseChartInstance.data.datasets[0].data.length - 1];
                const lastArray = nodePulseChartInstance.data.datasets[1].data[nodePulseChartInstance.data.datasets[1].data.length - 1];
                const lastRepo = nodePulseChartInstance.data.datasets[2].data[nodePulseChartInstance.data.datasets[2].data.length - 1];

                const newDataPointCore = Math.floor(Math.max(0, lastCore + (Math.random() - 0.5) * 20));
                const newDataPointArray = Math.floor(Math.max(0, lastArray + (Math.random() - 0.5) * 30));
                const newDataPointRepo = Math.floor(Math.max(0, lastRepo + (Math.random() - 0.5) * 10));

                nodePulseChartInstance.data.labels.push(\`Tick ${nodePulseChartInstance.data.labels.length + 1}\`);
                nodePulseChartInstance.data.datasets[0].data.push(newDataPointCore);
                nodePulseChartInstance.data.datasets[1].data.push(newDataPointArray);
                nodePulseChartInstance.data.datasets[2].data.push(newDataPointRepo);

                if (nodePulseChartInstance.data.labels.length > dataPoints) {
                    nodePulseChartInstance.data.labels.shift();
                    nodePulseChartInstance.data.datasets[0].data.shift();
                    nodePulseChartInstance.data.datasets[1].data.shift();
                    nodePulseChartInstance.data.datasets[2].data.shift();
                }
                nodePulseChartInstance.update();
            }, 1000);
        }

        // Spotify API Integration
        const spotifyToken = 'BQBDSZ232IQmSLV1BROkxqdwNMoGhtitKOJBjDzE-Lu9YKsSK1RKVwXNfYfncP2wf6Fj6xcYlnGD75baEqOmd3XtxhUhB-X6koPd92H9S0rQBqZ0HSKpsb04HiAme_FtqVLket7_s07gH9y1nxuPhbRyxp0r59oXtovV-uw0lCt2B7Mh5OmN3untEAGhfg6a6AZsaWLsv02dh6zKOQ_6DXHvCHZWxcVmoggu4eLA2NrqAf8rFRSNOw6HQpaN-VZkJWblznWQ0pT7ynzjpKOPlM_70N7vOLIZF8XnRmN1Oe784V-XfYNV-j1x1kdXGEpzlx1'; // Replace with valid token
        let globalTopTracks = [];
        let spotifyUserId = null;

        async function fetchWebApi(endpoint, method, body) {
            try {
                const res = await fetch(\`https://api.spotify.com/${endpoint}\`, {
                    headers: {
                        Authorization: \`Bearer ${spotifyToken}\`,
                        'Content-Type': 'application/json'
                    },
                    method,
                    body: body ? JSON.stringify(body) : null
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    console.error('Spotify API Error:', errorData);
                    displaySpotifyMessage(\`Error: ${errorData.error.message || 'Something went wrong with Spotify API.'}\`, 'red');
                    return null;
                }
                return await res.json();
            } catch (error) {
                console.error('Network or other error:', error);
                displaySpotifyMessage(\`Network error: ${error.message}\`, 'red');
                return null;
            }
        }

        async function getSpotifyUserProfile() {
            return await fetchWebApi('v1/me', 'GET');
        }

        async function getTopTracks() {
            displaySpotifyMessage('Fetching your top tracks...', 'gray');
            const topTracksListElement = document.getElementById('top-tracks-list');
            const topTracksUl = topTracksListElement?.querySelector('ul');
            if (topTracksUl) topTracksUl.innerHTML = '';
            topTracksListElement?.classList.remove('hidden');
            document.getElementById('audio-players').innerHTML = '';

            try {
                const response = (await fetchWebApi('v1/me/top/tracks?time_range=long_term&limit=5', 'GET'));
                if (response && response.items && response.items.length > 0) {
                    globalTopTracks = response.items;
                    globalTopTracks.forEach(track => {
                        const li = document.createElement('li');
                        li.innerHTML = \`<strong>${track.name}</strong> by ${track.artists.map(artist => artist.name).join(', ')}\`;
                        topTracksUl?.appendChild(li);
                    });
                    displaySpotifyMessage('Top 5 tracks fetched successfully!', 'green');
                } else {
                    if (topTracksUl) topTracksUl.innerHTML = '<li>No top tracks found or an error occurred.</li>';
                    displaySpotifyMessage('Could not retrieve top tracks. Please check your token and try again.', 'red');
                    globalTopTracks = [];
                }
            } catch (error) {
                console.error('Error getting top tracks:', error);
                displaySpotifyMessage('Failed to fetch top tracks.', 'red');
                globalTopTracks = [];
            }
        }

        async function createPlaylistAndSaveSongs() {
            if (globalTopTracks.length === 0) {
                displaySpotifyMessage('Please fetch your top tracks first!', 'orange');
                return;
            }
            displaySpotifyMessage('Creating playlist and adding songs...', 'gray');
            try {
                const userProfile = await getSpotifyUserProfile();
                if (!userProfile || !userProfile.id) {
                    displaySpotifyMessage('Could not retrieve user profile to create playlist. Is your token valid?', 'red');
                    return;
                }
                spotifyUserId = userProfile.id;
                const playlistName = \`My Seedwave Top Tracks - ${new Date().toLocaleDateString()}\`;
                const playlistDescription = "Top 5 tracks generated by Seedwave's Global Synergy Hub!";
                const createPlaylistResponse = await fetchWebApi(
                    \`v1/users/${spotifyUserId}/playlists\`, 'POST', { name: playlistName, public: false, description: playlistDescription }
                );
                if (!createPlaylistResponse || !createPlaylistResponse.id) {
                    displaySpotifyMessage('Failed to create playlist.', 'red');
                    return;
                }
                const playlistId = createPlaylistResponse.id;
                const trackUris = globalTopTracks.map(track => track.uri);
                const addItemsResponse = await fetchWebApi(
                    \`v1/playlists/${playlistId}/tracks\`, 'POST', { uris: trackUris }
                );
                if (addItemsResponse && addItemsResponse.snapshot_id) {
                    displaySpotifyMessage(\`Playlist "${playlistName}" created and tracks added successfully!\`, 'green');
                } else {
                    displaySpotifyMessage('Failed to add tracks to playlist.', 'red');
                }
            } catch (error) {
                console.error('Error creating/saving playlist:', error);
                displaySpotifyMessage('Failed to create or save playlist.', 'red');
            }
        }

        async function playTopTracks() {
            if (globalTopTracks.length === 0) {
                displaySpotifyMessage('Please fetch your top tracks first!', 'orange');
                return;
            }
            displaySpotifyMessage('Loading audio players...', 'gray');
            const audioPlayersDiv = document.getElementById('audio-players');
            if (audioPlayersDiv) audioPlayersDiv.innerHTML = '';
            globalTopTracks.forEach(track => {
                const trackId = track.id;
                const iframe = document.createElement('iframe');
                iframe.src = \`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0\`;
                iframe.width = "100%";
                iframe.height = "80";
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
                audioPlayersDiv?.appendChild(iframe);
            });
            displaySpotifyMessage('Audio players loaded!', 'green');
        }

        function displaySpotifyMessage(message, type = 'gray') {
            const msgBox = document.getElementById('playlist-message');
            if (msgBox) {
                msgBox.textContent = message;
                msgBox.className = 'mt-6 p-4 rounded-lg border';
                msgBox.classList.remove('hidden');
                if (type === 'green') { msgBox.classList.add('bg-green-800', 'bg-opacity-30', 'border-green-700'); }
                else if (type === 'red') { msgBox.classList.add('bg-red-800', 'bg-opacity-30', 'border-red-700'); }
                else if (type === 'orange') { msgBox.classList.add('bg-orange-800', 'bg-opacity-30', 'border-orange-700'); }
                else { msgBox.classList.add('bg-gray-800', 'bg-opacity-30', 'border-gray-700'); }
            }
        }

        // Currency Converter Logic
        async function convertCurrency() {
            const amountInput = document.getElementById('amount');
            const fromCurrencySelect = document.getElementById('fromCurrency');
            const toCurrencySelect = document.getElementById('toCurrency');
            const resultElement = document.getElementById('convertedResult');

            if (!amountInput || !fromCurrencySelect || !toCurrencySelect || !resultElement) return;

            const amount = parseFloat(amountInput.value);
            const fromCurrency = fromCurrencySelect.value;
            const toCurrency = toCurrencySelect.value;

            if (isNaN(amount) || amount <= 0) {
                resultElement.textContent = 'Please enter a valid amount.';
                return;
            }

            resultElement.textContent = \`Converting ${amount} ${fromCurrency} to ${toCurrency}...\`;

            const exchangeRates = {
                "USD": {"EUR": 0.92, "GBP": 0.79, "JPY": 157.80, "AUD": 1.50, "CAD": 1.37, "CHF": 0.90, "CNY": 7.26, "ZAR": 18.25},
                "EUR": {"USD": 1.08, "GBP": 0.86, "JPY": 171.00, "AUD": 1.63, "CAD": 1.48, "CHF": 0.98, "CNY": 7.87, "ZAR": 19.80},
                "GBP": {"USD": 1.27, "EUR": 1.16, "JPY": 198.80, "AUD": 1.90, "CAD": 1.73, "CHF": 1.15, "CNY": 9.15, "ZAR": 23.00},
                "JPY": {"USD": 0.0063, "EUR": 0.0058, "GBP": 0.0050, "AUD": 0.0095, "CAD": 0.0087, "CHF": 0.0057, "CNY": 0.046, "ZAR": 0.11},
                "AUD": {"USD": 0.67, "EUR": 0.61, "GBP": 0.53, "JPY": 105.00, "CAD": 0.92, "CHF": 0.60, "CNY": 4.80, "ZAR": 12.10},
                "CAD": {"USD": 0.73, "EUR": 0.67, "GBP": 0.58, "JPY": 115.00, "AUD": 1.09, "CHF": 0.66, "CNY": 5.29, "ZAR": 13.30},
                "CHF": {"USD": 1.11, "EUR": 1.02, "GBP": 0.87, "JPY": 174.00, "AUD": 1.65, "CAD": 1.51, "CNY": 8.00, "ZAR": 20.15},
                "CNY": {"USD": 0.14, "EUR": 0.13, "GBP": 0.11, "JPY": 21.60, "AUD": 0.21, "CAD": 0.19, "CHF": 0.12, "ZAR": 2.51},
                "ZAR": {"USD": 0.055, "EUR": 0.050, "GBP": 0.043, "JPY": 8.90, "AUD": 0.083, "CAD": 0.075, "CHF": 0.049, "CNY": 0.39}
            };

            const rate = exchangeRates[fromCurrency] ? exchangeRates[fromCurrency][toCurrency] : null;

            if (fromCurrency === toCurrency) {
                resultElement.textContent = \`${amount.toFixed(2)} ${fromCurrency} = ${amount.toFixed(2)} ${toCurrency}\`;
                return;
            }

            if (rate) {
                const convertedAmount = amount * rate;
                resultElement.textContent = \`${amount.toFixed(2)} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}\`;
            } else {
                resultElement.textContent = 'Conversion rate not available for selected currencies.';
            }
        }

        // Planet Pulse Text Logic
        const planetPhrases = [
            { text: "fruchtbarer.planet.wandel", lang: "de" },
            { text: "fertile.planet.change", lang: "en" },
            { text: "planète.fertile.changement", lang: "fr" },
            { text: "planeta.fértil.cambio", lang: "es" },
            { text: "丰饶。星球。变革", lang: "zh" },
            { text: "उर्वर। ग्रह। परिवर्तन", lang: "hi" },
            { text: "كوكب.خصب.تغيير", lang: "ar" }
        ];
        let currentPhraseIndex = 0;

        function updatePlanetText() {
            const planetTextElement = document.getElementById('planet-text');
            if (planetTextElement) {
                planetTextElement.style.animation = 'none';
                void planetTextElement.offsetWidth;
                planetTextElement.style.animation = '';

                currentPhraseIndex = (currentPhraseIndex + 1) % planetPhrases.length;
                const nextPhrase = planetPhrases[currentPhraseIndex];
                
                planetTextElement.textContent = nextPhrase.text;
                planetTextElement.lang = nextPhrase.lang;
            }
        }

        // AI-Powered Help/FAQ Logic
        async function getFaqAnswer() {
            const faqPromptInput = document.getElementById('faqPromptInput');
            const faqAnswerOutput = document.getElementById('faqAnswerOutput');
            const faqLoadingIndicator = document.getElementById('faqLoadingIndicator');
            const getFaqAnswerBtn = document.getElementById('getFaqAnswerBtn');

            if (!faqPromptInput || !faqAnswerOutput || !faqLoadingIndicator || !getFaqAnswerBtn) {
                console.warn("AI text generation elements not found in DOM.");
                return;
            }

            const prompt = faqPromptInput.value.trim();
            if (!prompt) {
                faqAnswerOutput.textContent = translations[document.body.lang]['please-enter-question'];
                faqAnswerOutput.style.color = "red";
                return;
            }

            faqAnswerOutput.textContent = '';
            faqAnswerOutput.style.color = "var(--text-color-dark)";
            faqLoadingIndicator.classList.remove('hidden');
            getFaqAnswerBtn.disabled = true;

            try {
                const fullPrompt = \`The user has a question about AgroChain™, Banimal Loop™, or FAA.zone. Answer this question as precisely and concisely as possible. If the question is not related to AgroChain™, Banimal Loop™, or FAA.zone, please state that you can only answer questions on these topics.

                User's question: "${prompt}"

                Information to consider:
                - AgroChain™ is a powerful FAA.zone™ framework empowering the Agriculture & Biotech sector with advanced automation and data management, connecting to PulseGrid™ for optimized workflow and compliance.
                - Banimal Loop™ focuses on ethical impact, creature data synthesis, Baobab Network integration, and ethical loop verification, related to thoughtful baby essentials and innovative lighting, sponsoring an item for a child in need for every purchase.
                - FAA.zone™ is an ecosystem for critical information and distributed processes, focusing on Decentralized Data Integrity, Secure Data Orchestration, Scalable & Resilient Infrastructure, Verifiable Trust & Identity, and Compliance & Audit Trails.
                - VaultMesh™ is the core infrastructure powering FAA.zone™.

                Answer:\`;

                let chatHistory = [];
                chatHistory.push({ role: "user", parts: [{ text: fullPrompt }] });
                const payload = { contents: chatHistory };
                const apiKey = "";
                const apiUrl = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}\`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    faqAnswerOutput.textContent = text;
                } else {
                    faqAnswerOutput.textContent = translations[document.body.lang]['error-no-ai-answer'];
                    faqAnswerOutput.style.color = "red";
                    if (result.error && result.error.message) {
                        faqAnswerOutput.textContent += \` ${translations[document.body.lang]['reason']} ${result.error.message}\`;
                    }
                }
            } catch (error) {
                faqAnswerOutput.textContent = translations[document.body.lang]['error-ai-connection'];
                faqAnswerOutput.style.color = "red";
                console.error("Error calling Gemini API:", error);
            } finally {
                faqLoadingIndicator.classList.add('hidden');
                getFaqAnswerBtn.disabled = false;
            }
        }


        // Document Ready / Initialization
        document.addEventListener('DOMContentLoaded', () => {
            // console.log("DOMContentLoaded event fired. Starting initializations."); // Debugging line

            const announcementBar = document.getElementById('announcement-bar');

            // --- Announcement Bar Logic ---
            const updateAnnouncementBarPosition = () => {
                const announcementHeight = announcementBar && !announcementBar.classList.contains('hidden') ? announcementBar.offsetHeight : 0;
                document.documentElement.style.setProperty('--announcement-bar-height', \`${announcementHeight}px\`);
                // console.log(\`Announcement bar height set to: ${announcementHeight}px\`); // Debugging line
            };

            if (announcementBar && announcementBar.querySelector('.close-btn')) {
                announcementBar.querySelector('.close-btn').addEventListener('click', () => {
                    announcementBar.classList.add('hidden');
                    updateAnnouncementBarPosition();
                    localStorage.setItem('hideAnnouncementBar', 'true');
                    // console.log("Announcement bar closed."); // Debugging line
                });
            }
            if (localStorage.getItem('hideAnnouncementBar') === 'true') {
                announcementBar?.classList.add('hidden');
                // console.log("Announcement bar hidden (preference)."); // Debugging line
            }
            updateAnnouncementBarPosition(); // Initial positioning
            window.addEventListener('resize', updateAnnouncementBarPosition);
            // console.log("Announcement bar logic initialized."); // Debugging line


            // --- Theme Switching Logic ---
            const themeDayBtn = document.getElementById('theme-day-btn');
            const themeNightBtn = document.getElementById('theme-night-btn');
            const themeHyperBtn = document.getElementById('theme-hyper-btn');

            function setTheme(theme) {
                document.body.classList.remove('light-mode', 'dark-mode', 'hyper-mode');
                themeDayBtn?.classList.remove('active');
                themeNightBtn?.classList.remove('active');
                themeHyperBtn?.classList.remove('active');

                if (theme === 'dark') {
                    document.body.classList.add('dark-mode');
                    themeNightBtn?.classList.add('active');
                } else if (theme === 'hyper') {
                    document.body.classList.add('hyper-mode');
                    themeHyperBtn?.classList.add('active');
                } else {
                    document.body.classList.add('light-mode');
                    themeDayBtn?.classList.add('active');
                }
                localStorage.setItem('themeMode', theme);
                // console.log(\`Theme set to: ${theme}\`); // Debugging line
                // Re-render chart for theme consistency
                if (nodePulseChartInstance) {
                    renderNodePulseChart();
                    // console.log("Node Pulse Chart re-rendered for new theme."); // Debugging line
                }
            }

            if (themeDayBtn && themeNightBtn && themeHyperBtn) {
                themeDayBtn.addEventListener('click', () => setTheme('day'));
                themeNightBtn.addEventListener('click', () => setTheme('dark'));
                themeHyperBtn.addEventListener('click', () => setTheme('hyper'));

                const savedTheme = localStorage.getItem('themeMode') || 'dark'; // Default to dark mode
                setTheme(savedTheme);
                // console.log(\`Initial theme loaded: ${savedTheme}\`); // Debugging line
            } else {
                console.warn("Theme buttons not found in DOM.");
            }

            // --- Language Switcher Logic ---
            const languageSwitcher = document.getElementById('languageSwitcher');
            if (languageSwitcher) {
                for (const langCode in translations) {
                    const option = document.createElement('option');
                    option.value = langCode;
                    option.textContent = translations[langCode]["lang-name"] || langCode.toUpperCase();
                    languageSwitcher.appendChild(option);
                }
                languageSwitcher.addEventListener('change', (e) => {
                    const selectedLang = e.target.value;
                    setLanguage(selectedLang);
                    // console.log(\`Language changed to: ${selectedLang}\`); // Debugging line
                });
                const initialLang = localStorage.getItem('selectedLanguage') || 'en';
                languageSwitcher.value = initialLang;
                setLanguage(initialLang);
                // console.log(\`Initial language loaded: ${initialLang}\`); // Debugging line
            } else {
                console.warn("Language switcher not found in DOM.");
            }

            // --- Initialize all canvases and start animations ---
            // console.log("Initializing canvas elements..."); // Debugging line
            setupCanvas('header-pulse-canvas', headerPulse);
            if (headerPulse.canvas) startHeaderPulseAnimation();

            setupCanvas('canvas-rhythmic', canvases.rhythmic);
            setupCanvas('canvas-concentric', canvases.concentric);
            setupCanvas('canvas-shooting', canvases.shooting);
            setupCanvas('canvas-particles', canvases.particles);
            setupCanvas('canvas-radial-bursts', canvases.radialBursts);
            setupCanvas('canvas-hyperspace', canvases.hyperspace);

            for (const key in canvases) {
                if (canvases[key].canvas) {
                    startCanvasAnimation(key);
                } else {
                    console.error(\`Skipping animation for ${key} as its canvas element was not found during setup.\`);
                }
            }
            // console.log("Canvas initializations and animations started (check console for individual canvas status)."); // Debugging line

            // Initial resize and subsequent resize listener for all canvases
            resizeAllCanvases();
            window.addEventListener('resize', resizeAllCanvases);
            // console.log("Canvas resize listeners attached."); // Debugging line

            // Render Node Pulse Chart
            renderNodePulseChart();
            // console.log("Node Pulse Chart initialized."); // Debugging line

            // Smooth scrolling for navigation links (if any, though removed from header, good for CTA buttons)
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href'))?.scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });
            // console.log("Smooth scroll listeners attached."); // Debugging line

            // Add event listeners for Spotify buttons
            document.getElementById('getTopTracksBtn')?.addEventListener('click', getTopTracks);
            document.getElementById('createPlaylistBtn')?.addEventListener('click', createPlaylistAndSaveSongs);
            document.getElementById('playTracksBtn')?.addEventListener('click', playTopTracks);
            // console.log("Spotify button listeners attached."); // Debugging line

            // Add event listener for Currency Converter button
            document.getElementById('convertCurrencyBtn')?.addEventListener('click', convertCurrency);
            convertCurrency(); // Initial conversion on page load
            // console.log("Currency converter initialized."); // Debugging line

            // Start Planet Pulse Text animation
            setInterval(updatePlanetText, 3000);
            // console.log("Planet pulse text animation started."); // Debugging line

            // Add event listener for AI Help/FAQ button
            document.getElementById('getFaqAnswerBtn')?.addEventListener('click', getFaqAnswer);
            // console.log("AI Help button listener attached."); // Debugging line

        });
    </script>
</body>
</html>`;

// Advanced Sector Index Dashboard with YOUR authentic complete business functionality
const advancedSectorIndexTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="dynamicTitle">Fruitful Global™ | Sector Index</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Leaflet CSS for OpenStreetMap -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
        /* Define a consistent color palette for Dashboard components within the overall dark theme */
        :root {
            --primary-color: #22c55e; /* Vibrant green */
            --secondary-color: #3b82f6; /* Blue for accents */
            --dark-bg-dashboard: #1a1a1d; /* Deep charcoal for dashboard specific elements */
            --medium-dark-bg-dashboard: #2a2a2e; /* Slightly lighter charcoal for dashboard specifics */
            --card-bg-dashboard: #374151; /* Dark gray for dashboard cards */
            --text-light-dashboard: #e0e0e0;
            --text-muted-dashboard: #9ca3af;
            --border-color-dashboard: #4b5563;

            /* Default Theme Colors (fallback/initial) */
            --sector-primary-color: #6366f1; /* Purple */
            --sector-secondary-color: #a855f7; /* Lighter Purple */
            --sector-accent-color: #f97316; /* Orange */
            --sector-button-color: #c084fc; /* Another purple for CTAs */
            --sector-background-gradient-start: #1f215a;
            --sector-background-gradient-end: #3b0764;
            --sector-text-color: #e2e8f0;
            --sector-muted-text: #a0aec0;
            --sector-card-bg: #1a1b20;
            --sector-border-color: rgba(255,255,255,0.1);

            /* Consolidated Fruitful Logo Color (now white) */
            --fruitful-corporate-white: #ffffff;
        }

        /* Base Styles - Cooler, darker, more vibrant (from Landing Page, prioritized) */
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0d1117; /* Darker base background */
            color: #e2e8f0; /* Lighter text for contrast */
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            overflow-x: hidden; /* Prevent horizontal scroll */
            display: flex; /* Make body a flex container for full height */
            flex-direction: column;
            min-height: 100vh;
        }

        /* Custom Scrollbar Styling for Dark Theme */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #1a1b20; /* Darker track */
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background: #4a4d5c; /* Muted gray thumb */
            border-radius: 10px;
            transition: background 0.3s ease;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #6b6e7f; /* Lighter on hover */
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        /* Header - Sleek and modern */
        header {
            background-color: rgba(26, 32, 44, 0.9); /* Darker, slightly transparent */
            backdrop-filter: blur(12px); /* Stronger frosted glass */
            border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* More visible border */
            padding-top: 1.2rem;
            padding-bottom: 1.2rem;
            box-shadow: 0 2px 15px rgba(0,0,0,0.4); /* Deeper shadow */
            position: sticky;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 50;
            display: flex; /* Ensure it's a flex container */
            justify-content: space-between; /* Space out logo and nav */
            align-items: center;
        }
        header h1 {
            color: #e2e8f0; /* Light text for logo */
            font-weight: 800;
            font-size: 1.6rem;
            letter-spacing: -0.03em;
            background: linear-gradient(90deg, var(--sector-primary-color), var(--sector-secondary-color)); /* Vibrant gradient for logo text */
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        header nav a {
            color: #a0aec0; /* Muted gray for nav links */
            font-size: 0.95rem;
            font-weight: 500;
            padding: 0.6rem 1rem;
            border-radius: 8px; /* Softer rounding */
            transition: all 0.2s ease-in-out;
            position: relative;
        }
        header nav a:hover {
            color: #e2e8f0; /* Brighter on hover */
            background-color: rgba(99, 102, 241, 0.1); /* Subtle purple tint on hover */
            transform: translateY(-2px); /* Slight lift */
        }
        header nav a::after { /* Underline effect */
            content: '';
            position: absolute;
            left: 50%;
            bottom: -2px;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--sector-secondary-color), var(--sector-primary-color));
            transition: all 0.3s ease-out;
            transform: translateX(-50%);
            border-radius: 1px;
        }
        header nav a:hover::after {
            width: 80%;
        }
        header nav a.header-sign-up { /* Sign Up button */
            background: linear-gradient(90deg, var(--sector-primary-color), var(--sector-secondary-color)); /* Vibrant gradient */
            color: white;
            padding: 0.7rem 1.4rem;
            border-radius: 25px; /* More pill-shaped */
            font-weight: 700;
            font-size: 0.95rem;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            transition: all 0.3s ease-out;
        }
        header nav a.header-sign-up:hover {
            filter: brightness(1.15);
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.4), 0 0 15px rgba(168, 85, 247, 0.5); /* Subtle glow */
        }
        /* Active link for both landing page sections and dashboard toggle */
        .header-nav-active {
            color: white !important;
            font-weight: 700 !important;
        }
        .header-nav-active::after {
            width: 100% !important;
            background: linear-gradient(90deg, var(--sector-secondary-color), var(--sector-primary-color)) !important;
        }

        /* Hero Section - Dynamic and impactful */
        .hero-section {
            background: linear-gradient(135deg, var(--sector-background-gradient-start), var(--sector-background-gradient-end)); /* Deeper, richer gradient */
            min-height: 80vh;
            padding: 8rem 2rem;
            border-bottom-left-radius: 60px;
            border-bottom-right-radius: 60px;
            box-shadow: 0 15px 50px rgba(0,0,0,0.7);
            color: var(--sector-text-color);
            position: relative;
            overflow: hidden;
            animation: fadeInScale 1s ease-out;
        }
        .hero-section::before { /* Animated background pattern */
            content: '';
            position: absolute;
            top: -20%;
            left: -20%;
            width: 140%;
            height: 140%;
            background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1), transparent 70%),
                        radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1), transparent 70%);
            animation: rotateAndZoom 40s linear infinite;
            opacity: 0.6;
            z-index: 1;
        }
        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes rotateAndZoom {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.05); }
            100% { transform: rotate(360deg) scale(1); }
        }
        .hero-content {
            z-index: 10;
            position: relative;
        }
        .hero-section h2 {
            font-size: 4.5rem; /* Even larger, bolder headline */
            font-weight: 900;
            letter-spacing: -0.04em;
            line-height: 1.05;
            text-shadow: 0 4px 15px rgba(0,0,0,0.5);
        }
        .hero-section h2 span {
            background: linear-gradient(90deg, var(--sector-accent-color), var(--sector-secondary-color)); /* Warm gradient accent */
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .hero-section p {
            font-size: 1.3rem;
            font-weight: 300; /* Lighter weight for body text */
            color: var(--sector-muted-text); /* Slightly muted white */
            margin-top: 2rem;
            margin-bottom: 3rem;
            max-width: 900px;
        }
        .cta-button {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: linear-gradient(90deg, var(--sector-primary-color), var(--sector-button-color)); /* Brighter purple gradient */
            color: white;
            padding: 1rem 2.5rem;
            border-radius: 30px;
            font-weight: 700;
            font-size: 1.15rem;
            transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            box-shadow: 0 5px 20px rgba(0,0,0,0.4);
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }
        .cta-button:hover {
            filter: brightness(1.2);
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 8px 25px rgba(0,0,0,0.5), 0 0 25px rgba(192, 132, 252, 0.8); /* Subtle glow */
        }
        .cta-button span { /* Re-add emoji for "cooler" vibe if desired */
            display: inline-block;
            margin-left: 0.5rem;
            animation: bounceEmoji 1s infinite alternate;
        }
        @keyframes bounceEmoji {
            from { transform: translateY(0); }
            to { transform: translateY(-3px); }
        }


        /* Sections - Layered and defined */
        .landing-section { /* Applied to all main landing sections */
            padding: 8rem 2rem;
            background-color: #121317; /* Darker section background */
            box-shadow: inset 0 5px 20px rgba(0,0,0,0.2); /* Inner shadow for depth */
            border-bottom: 1px solid rgba(255,255,255,0.08); /* Subtle separator */
            color: var(--sector-text-color);
        }
        .landing-section:nth-of-type(odd) { /* Alternate background for sections */
            background-color: #0d1117;
        }
        .landing-section:last-of-type {
            border-bottom: none;
        }
        .landing-section h2, .landing-section h3 {
            color: var(--sector-text-color);
            font-weight: 800;
            letter-spacing: -0.03em;
            margin-bottom: 2.5rem;
            font-size: 2.8rem;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .landing-section p {
            color: var(--sector-muted-text);
            font-size: 1.15rem;
            line-height: 1.6;
        }

        /* Feature Cards - Glowing and interactive */
        .feature-card {
            background-color: var(--sector-card-bg); /* Dark card background */
            border-radius: 16px;
            padding: 2.5rem;
            box-shadow: 0 5px 20px rgba(0,0,0,0.6);
            transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease-in-out, border-color 0.3s ease;
            border: 1px solid var(--sector-border-color);
        }
        .feature-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.7), 0 0 25px var(--sector-secondary-color); /* Stronger glow on hover */
            border-color: var(--sector-secondary-color); /* Purple border on hover */
        }
        .feature-card div:first-child { /* Icon */
            font-size: 3rem;
            margin-bottom: 1.5rem;
            color: var(--sector-primary-color); /* Electric blue for icons */
            text-shadow: 0 0 15px rgba(0, 191, 255, 0.6); /* Icon glow */
        }
        .feature-card h4 {
            font-size: 1.4rem;
            font-weight: 700;
            color: var(--sector-text-color);
            margin-bottom: 0.75rem;
        }
        .feature-card p {
            font-size: 1rem;
            color: var(--sector-muted-text);
        }

        /* Share Signal Section - Digital display feel */
        #shareprice {
            background-color: var(--sector-card-bg);
            color: var(--sector-text-color);
            padding: 5rem 2rem;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            box-shadow: inset 0 5px 20px rgba(0,0,0,0.2);
        }
        #shareprice h2 {
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--sector-text-color);
        }
        #price {
            font-size: 4rem;
            font-weight: 800;
            color: var(--primary-color); /* Neon green for price */
            letter-spacing: -0.03em;
            text-shadow: 0 0 20px rgba(0, 227, 147, 0.6); /* Strong glow */
            animation: pricePulse 2s infinite alternate;
        }
        @keyframes pricePulse {
            from { text-shadow: 0 0 10px rgba(0, 227, 147, 0.4); }
            to { text-shadow: 0 0 25px rgba(0, 227, 147, 0.8); }
        }
        #timestamp {
            color: var(--sector-muted-text);
            font-size: 0.9rem;
        }

        /* Seedwave Growth - Dynamic chart */
        #seedwave {
            background-color: #0d1117;
            padding: 6rem 2rem;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            box-shadow: inset 0 5px 20px rgba(0,0,0,0.2);
        }
        #seedwave h2 {
            font-size: 2.8rem;
            font-weight: 800;
            margin-bottom: 3rem;
            color: var(--sector-text-color);
        }
        #seedwave .w-full {
            background-color: var(--sector-card-bg);
            border: 1px solid rgba(255,255,255,0.15);
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.6);
        }

        /* Founder's Note - Evocative text block */
        .landing-section.bg-gray-700 { /* Founder's Note */
            background-color: #121317;
            color: var(--sector-text-color);
            padding: 6rem 2rem;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            box-shadow: inset 0 5px 20px rgba(0,0,0,0.2);
        }
        .landing-section.bg-gray-700 h2 {
            font-size: 3rem;
            font-weight: 800;
            color: var(--sector-text-color);
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
            animation: textGlow 3s infinite alternate;
        }
        @keyframes textGlow {
            from { text-shadow: 0 0 5px rgba(255,255,255,0.2); }
            to { text-shadow: 0 0 15px rgba(255,255,255,0.5); }
        }
        .landing-section.bg-gray-700 p {
            font-size: 1.2rem;
            color: var(--sector-muted-text);
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }
        .landing-section.bg-gray-700 p.italic {
            color: var(--sector-muted-text);
            font-style: italic;
        }
        .landing-section.bg-gray-700 p.font-semibold {
            color: var(--primary-color); /* Electric blue signature */
            font-weight: 600;
            margin-top: 2.5rem;
            text-shadow: 0 0 8px rgba(0, 191, 255, 0.4);
        }

        /* Vault Terminal Access - Futuristic interface */
        #vault-access {
            background-color: #0d1117;
            padding: 6rem 2rem;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            box-shadow: inset 0 5px 20px rgba(0,0,0,0.2);
        }
        #vault-access h3 {
            font-size: 2.8rem;
            font-weight: 800;
            color: var(--sector-text-color);
            margin-bottom: 3rem;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        #vault-access .w-full.h-\[800px\] { /* Iframe container */
            background-color: #000000;
            border: 3px solid var(--primary-color); /* Neon green border */
            border-radius: 12px;
            box-shadow: 0 0 30px rgba(0, 227, 147, 0.5); /* Stronger glow */
            overflow: hidden;
        }
        .terminal-btn {
            background-color: var(--sector-card-bg);
            color: var(--primary-color); /* Electric blue text */
            padding: 1.2rem 1.8rem;
            border-radius: 10px;
            font-weight: 600;
            transition: all 0.2s ease-in-out;
            box-shadow: 0 2px 10px rgba(0,0,0,0.4);
            border: 1px solid #333333;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .terminal-btn:hover {
            background-color: #2a2c33;
            color: var(--sector-text-color);
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.5), 0 0 20px var(--primary-color);
            border-color: var(--primary-color);
        }
        .terminal-btn.ring { /* Active state */
            border-color: var(--primary-color); /* Neon green active ring */
            box-shadow: 0 0 0 3px rgba(0, 227, 147, 0.5);
        }

        /* Sector Scrolls - Grid of glowing links */
        .landing-section.bg-gray-800.text-center { /* Sector Scrolls */
            background-color: #121317;
            padding: 6rem 2rem;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            box-shadow: inset 0 5px 20px rgba(0,0,0,0.2);
        }
        .landing-section.bg-gray-800.text-center h2 {
            font-size: 2.8rem;
            font-weight: 800;
            margin-bottom: 3rem;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
            color: var(--sector-text-color);
        }
        .glyph {
            background-color: var(--sector-card-bg);
            color: var(--primary-color); /* Electric blue text */
            padding: 1rem 1.5rem;
            border-radius: 10px;
            font-weight: 600;
            transition: all 0.2s ease-in-out;
            box-shadow: 0 2px 10px rgba(0,0,0,0.4);
            border: 1px solid #333333;
        }
        .glyph:hover {
            background-color: #2a2c33;
            color: var(--sector-text-color);
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.5), 0 0 15px var(--primary-color);
            border-color: var(--primary-color);
        }

        /* Treaty Section - Powerful statement */
        #treaty {
            background-color: #0d1117;
            padding: 6rem 2rem;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            box-shadow: inset 0 5px 20px rgba(0,0,0,0.2);
        }
        #treaty h2 {
            font-size: 2.8rem;
            font-weight: 800;
            color: var(--sector-text-color);
            margin-bottom: 2rem;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        #treaty p {
            font-size: 1.2rem;
            color: var(--sector-muted-text);
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 2.5rem;
        }
        #treaty blockquote {
            font-size: 1.8rem;
            color: var(--primary-color); /* Neon green for quote */
            font-weight: 700;
            line-height: 1.4;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            text-shadow: 0 0 15px rgba(0, 227, 147, 0.5);
        }
        #treaty blockquote::before, #treaty blockquote::after {
            content: '“';
            font-size: 3em;
            line-height: 0.1;
            vertical-align: -0.4em;
            color: #333333; /* Muted quote color */
            margin-right: 0.1em;
        }
        #treaty blockquote::after {
            content: '”';
            margin-left: 0.05em;
        }

        /* Signal Packet - Hacker console feel */
        .landing-section.py-10.text-xs.text-center { /* Signal Packet */
            background-color: #0a0a0a;
            color: var(--primary-color);
            padding: 4rem 2rem;
            border-bottom: 1px solid #333;
            box-shadow: inset 0 5px 20px rgba(0,0,0,0.4);
        }
        .landing-section.py-10.text-xs.text-center pre {
            background-color: #000000;
            border: 1px solid var(--primary-color); /* Neon green border */
            border-radius: 10px;
            padding: 2rem;
            box-shadow: 0 0 20px rgba(0, 227, 147, 0.4); /* Strong glow */
            white-space: pre-wrap;
            word-break: break-all;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
            font-size: 0.9rem;
        }

        /* VaultMesh Executive Summary - Structured and powerful */
        #vaultmesh {
            background-color: #121317;
            padding: 6rem 2rem;
            color: var(--sector-text-color);
            border-bottom: 1px solid rgba(255,255,255,0.08);
            box-shadow: inset 0 5px 20px rgba(0,0,0,0.2);
        }
        #vaultmesh h2 {
            font-size: 2.8rem;
            font-weight: 800;
            color: var(--sector-text-color);
            margin-bottom: 2rem;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        #vaultmesh h2.text-purple-400 {
            background: linear-gradient(90deg, var(--sector-primary-color), var(--sector-secondary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        #vaultmesh h3 {
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--sector-text-color);
            margin-top: 3rem;
            margin-bottom: 1.2rem;
        }
        #vaultmesh p {
            font-size: 1.1rem;
            color: var(--sector-muted-text);
            line-height: 1.6;
        }
        #vaultmesh ul {
            list-style-type: none; /* Remove default bullets */
            padding-left: 0;
            margin-left: 0;
            color: var(--sector-muted-text);
        }
        #vaultmesh ul li {
            font-size: 1.1rem;
            margin-bottom: 0.75rem;
            position: relative;
            padding-left: 1.5rem;
        }
        #vaultmesh ul li::before { /* Custom bullet point */
            content: '•';
            position: absolute;
            left: 0;
            color: var(--primary-color); /* Electric blue bullet */
            font-size: 1.2em;
            line-height: 1;
            top: 0.1em;
        }
        #vaultmesh ul.list-decimal li::before { /* Ensure decimal still works if applied */
            content: counter(list-item) ".";
            color: var(--primary-color); /* Neon green for numbered lists */
        }
        #vaultmesh code {
            background-color: #2a2c33;
            padding: 0.3em 0.6em;
            border-radius: 6px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
            color: var(--primary-color);
            border: 1px solid #444444;
        }

        /* About Section - Clean and impactful */
        #about {
            background-color: #0d1117;
            padding: 6rem 2rem;
            color: var(--sector-text-color);
            border-bottom: 1px solid rgba(255,255,255,0.08);
            box-shadow: inset 0 5px 20px rgba(0,0,0,0.2);
        }
        #about h3 {
            font-size: 2.8rem;
            font-weight: 800;
            color: var(--sector-text-color);
            margin-bottom: 2rem;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        #about p {
            font-size: 1.2rem;
            color: var(--sector-muted-text);
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
        }

        /* Call to Action Section - Bold and inviting */
        #cta-landing { /* Renamed to avoid conflict with dashboard CTA button */
            background: linear-gradient(135deg, var(--sector-background-gradient-start), var(--sector-background-gradient-end)); /* Strong purple gradient */
            padding: 8rem 2rem;
            color: white;
            text-align: center;
            border-top-left-radius: 60px; /* Rounded top corners */
            border-top-right-radius: 60px;
            box-shadow: 0 -15px 50px rgba(0,0,0,0.7);
        }
        #cta-landing h3 {
            font-size: 3.5rem;
            font-weight: 900;
            color: white;
            margin-bottom: 2rem;
            line-height: 1.1;
            text-shadow: 0 4px 15px rgba(0,0,0,0.5);
        }
        #cta-landing p {
            font-size: 1.3rem;
            color: var(--sector-muted-text);
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 3rem;
        }
        #cta-landing .cta-button {
            background: var(--primary-color); /* Neon green button */
            color: #1a1a1a;
            padding: 1.2rem 3rem;
            border-radius: 30px;
            font-weight: 800;
            font-size: 1.25rem;
            transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            box-shadow: 0 5px 20px rgba(0,0,0,0.4);
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }
        #cta-landing .cta-button:hover {
            filter: brightness(1.2);
            transform: translateY(-5px) scale(1.03);
            box-shadow: 0 8px 25px rgba(0,0,0,0.5), 0 0 30px rgba(0, 227, 147, 0.8);
        }
        #cta-landing .cta-button span {
            display: inline-block;
            margin-left: 0.75rem;
            animation: bounceEmoji 1s infinite alternate;
        }

        /* Footer - Subtly integrated */
        footer {
            background-color: #0a0a0a;
            color: #6e6e73;
            padding: 2.5rem;
            font-size: 0.9rem;
            border-top: 1px solid rgba(255,255,255,0.05);
            box-shadow: inset 0 5px 15px rgba(0,0,0,0.3);
            text-align: center;
        }
        footer a {
            color: #6e6e73;
            text-decoration: none;
            transition: color 0.2s ease;
        }
        footer a:hover {
            color: #e2e8f0;
        }

        /* Dashboard Specific Styles (Adapted for overall theme) */
        #fruitful-dashboard-wrapper {
            background-color: #0d1117; /* Use main body background for wrapper */
        }
        .dashboard-header-bg { background-color: var(--medium-dark-bg-dashboard); }
        .dashboard-sidebar-bg { background-color: var(--medium-dark-bg-dashboard); }
        .dashboard-main-content-bg { background-color: #121317; } /* Use a slightly different dark tone */
        .dashboard-card-bg { background-color: var(--card-bg-dashboard); }
        .dashboard-primary-text { color: var(--primary-color); }
        .dashboard-secondary-text { color: var(--secondary-color); }
        .dashboard-muted-text { color: var(--text-muted-dashboard); }
        .dashboard-border-dark { border-color: var(--border-color-dashboard); }
        .dashboard-hover-bg-light { background-color: rgba(255, 255, 255, 0.1); }

        /* Responsive adjustments for Dashboard elements */
        .dashboard-container {
            display: flex;
            flex-grow: 1; /* Allow dashboard container to grow */
        }
        .dashboard-sidebar {
            width: 64; /* Tailwind w-64 */
            padding: 1.5rem; /* Tailwind p-6 */
            border-right: 1px solid var(--border-color-dashboard);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem; /* Tailwind space-y-4 converted to gap */
        }
        .dashboard-sidebar-nav-item {
            display: flex;
            align-items: center;
            gap: 0.75rem; /* Tailwind gap-3 */
            width: 100%;
            padding: 0.75rem; /* Tailwind p-3 */
            border-radius: 0.5rem; /* Tailwind rounded-lg */
            font-size: 1.125rem; /* Tailwind text-lg */
            font-weight: 500; /* Tailwind font-medium */
            transition: all 0.2s;
            color: var(--text-light-dashboard);
        }
        .dashboard-sidebar-nav-item:hover {
             background-color: var(--hover-bg-light);
        }

        .dashboard-active-nav-item {
            background-color: var(--primary-color);
            color: white !important;
        }
        .dashboard-active-nav-item:hover {
            background-color: var(--primary-color) !important;
        }

        .dashboard-main-content {
            flex-grow: 1;
            padding: 2rem; /* Tailwind p-8 */
            overflow-y: auto;
        }

        /* Music Sub-Sidebar */
        .music-sub-sidebar {
            width: 48; /* Tailwind w-48 */
            padding: 1rem; /* Tailwind p-4 */
            border-right: 1px solid var(--border-color-dashboard);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem; /* Tailwind space-y-3 */
            margin-right: 2rem; /* Tailwind mr-8 */
        }
        .music-sub-sidebar .dashboard-sidebar-nav-item {
            font-size: 1rem; /* Tailwind text-base */
            padding: 0.5rem; /* Tailwind p-2 */
            gap: 0.5rem; /* Tailwind gap-2 */
        }
        .music-content-area {
            flex-grow: 1;
        }

        /* Dashboard Card Styles */
        .dashboard-card {
            padding: 1.5rem; /* Tailwind p-6 */
            background-color: var(--card-bg-dashboard);
            border-radius: 0.5rem; /* Tailwind rounded-lg */
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); /* Tailwind shadow-xl */
            border: 1px solid var(--border-color-dashboard);
        }
        .dashboard-sub-card {
            padding: 1.25rem; /* Tailwind p-5 */
            background-color: #4a5568; /* a bit lighter gray for internal cards */
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .api-key-warning {
            color: #ef4444; /* red-500 */
            background-color: #fecaca; /* red-200 */
            border-left: 4px solid #ef4444;
            padding: 1rem;
            margin-top: 1rem;
            font-weight: 600;
        }
        /* Styles for map containers */
        gmp-map, #leaflet-map-container { /* Updated selector for gmp-map */
            height: 400px; /* Adjust height as needed */
            width: 100%;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            background-color: #374151; /* card-bg */
        }

        /* Form Styling for Sign-in/Sign-up/Settings */
        .auth-form-container {
            max-width: 500px;
            margin: 0 auto;
            padding: 2.5rem;
            background-color: var(--sector-card-bg);
            border-radius: 16px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.6);
            border: 1px solid var(--sector-border-color);
        }
        .auth-form-container h2 {
            font-size: 2.2rem;
            font-weight: 700;
            color: var(--sector-text-color);
            margin-bottom: 2rem;
            text-align: center;
        }
        .auth-form-container label {
            display: block;
            font-size: 1rem;
            color: var(--sector-muted-text);
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        .auth-form-container input[type="text"],
        .auth-form-container input[type="email"],
        .auth-form-container input[type="password"] {
            width: 100%;
            padding: 0.8rem 1rem;
            margin-bottom: 1.5rem;
            border-radius: 8px;
            border: 1px solid var(--border-color-dashboard);
            background-color: #2a2a2e; /* Slightly lighter than card bg */
            color: var(--text-light-dashboard);
            font-size: 1rem;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-form-container input[type="text"]:focus,
        .auth-form-container input[type="email"]:focus,
        .auth-form-container input[type="password"]:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.3); /* primary-color with opacity */
        }
        .auth-form-container button[type="submit"] {
            width: 100%;
            padding: 1rem 1.5rem;
            background: linear-gradient(90deg, var(--sector-primary-color), var(--sector-secondary-color));
            color: white;
            border: none;
            border-radius: 25px;
            font-weight: 700;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        }
        .auth-form-container button[type="submit"]:hover {
            filter: brightness(1.15);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.4), 0 0 15px rgba(168, 85, 247, 0.5);
        }
        .auth-form-container .text-center a {
            color: var(--secondary-color);
            text-decoration: none;
            transition: color 0.2s ease;
        }
        .auth-form-container .text-center a:hover {
            color: var(--primary-color);
        }

        /* Toggle switch for settings */
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
            margin-bottom: 1rem;
        }
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
            border-radius: 34px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: var(--primary-color);
        }
        input:focus + .slider {
            box-shadow: 0 0 1px var(--primary-color);
        }
        input:checked + .slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
        }


        /* Responsive adjustments for Core Brand sections */
        @media (max-width: 768px) {
            #core-brand-landing-page { padding-top: 6rem; padding-bottom: 6rem; }
            .core-brand-hero-content h1 { font-size: 3rem; }
            .core-brand-hero-content h1 span { font-size: 0.6em; }
            .core-brand-hero-content p { font-size: 1rem; }
            .button-container {
                flex-direction: column;
                gap: 1rem;
            }
            .featured-core-brand-section {
                padding: 4rem 1.5rem;
                margin: 2rem auto;
            }
            .featured-core-brand-section h2 {
                font-size: 2.2rem;
            }
            .featured-core-brand-section p {
                font-size: 1rem;
            }
            .featured-core-brand-section .cta-button {
                padding: 0.8rem 1.8rem;
                font-size: 1rem;
            }
            .dashboard-sidebar {
                width: 100%;
                height: auto;
                border-right: none;
                border-bottom: 1px solid var(--border-color-dashboard);
                padding-bottom: 1rem;
            }
            .dashboard-sidebar-nav-item {
                justify-content: center; /* Center items on small screens */
            }
            .dashboard-container {
                flex-direction: column;
            }
            .dashboard-main-content {
                width: 100%;
            }
            .grid-cols-2-md {
                grid-template-columns: 1fr; /* Stack columns on small screens */
            }
            /* Adjust main content padding when sidebars stack */
            .dashboard-main-content-wrapper {
                flex-direction: column;
            }
            .music-sub-sidebar {
                width: 100%;
                border-right: none;
                border-bottom: 1px solid var(--border-color-dashboard);
                padding-bottom: 1rem;
            }
            .music-content-area {
                width: 100%;
            }
        }

        /* Styling for Core Brand Landing Page specifically */
        #core-brand-landing-page {
            background: linear-gradient(135deg, var(--core-brand-bg-start), var(--core-brand-bg-end)); /* Use specific core brand colors */
            min-height: 100vh; /* Ensure it takes full viewport height */
            padding: 8rem 2rem;
            display: flex; /* Use flex to center content */
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: var(--core-brand-text-color);
            position: relative; /* For canvas z-index */
            z-index: 10; /* Ensure it's above other sections if they overlap */
            overflow: hidden; /* To contain particles */
        }

        /* Ensure canvas is behind content but visible */
        #core-brand-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1; /* Behind content */
        }

        .core-brand-hero-content {
            position: relative;
            z-index: 5; /* Above canvas */
            max-width: 900px;
            margin: 0 auto;
        }
        .core-brand-hero-content h1 {
            font-size: 4.5rem;
            font-weight: 900;
            line-height: 1.1;
            color: var(--core-brand-text-color);
            text-shadow: 0 5px 20px rgba(0,0,0,0.5);
        }
        .core-brand-hero-content h1 span {
            background: linear-gradient(90deg, var(--core-brand-accent-color), var(--core-brand-button-color)); /* Accent color */
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .core-brand-hero-content p {
            font-size: 1.3rem;
            color: var(--core-brand-muted-text);
            margin-top: 1.5rem;
            margin-bottom: 2.5rem;
        }
        .core-brand-cta-button {
            background: linear-gradient(90deg, var(--core-brand-button-color), var(--core-brand-button-color-dark)); /* Use core brand specific button colors */
            color: white;
            padding: 1rem 2.5rem;
            border-radius: 30px;
            font-weight: 700;
            font-size: 1.15rem;
            transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            box-shadow: 0 5px 20px rgba(0,0,0,0.4);
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }
        .core-brand-cta-button:hover {
            filter: brightness(1.2);
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 8px 25px rgba(0,0,0,0.5), 0 0 25px var(--core-brand-button-color);
        }
    </style>
</head>
<body>

    <header class="py-4 px-6 md:px-12 flex justify-between items-center text-white">
        <h1 id="headerFruitfulText" class="text-2xl font-extrabold tracking-tight">Fruitful™</h1>
        <nav class="flex items-center space-x-4">
            <a href="javascript:void(0)" class="header-nav-item transition-colors duration-200" onclick="showMainSection('hero-section')">Home</a>
            <a href="javascript:void(0)" class="header-nav-item transition-colors duration-200" onclick="showMainSection('features')">Features</a>
            <a href="javascript:void(0)" class="header-nav-item transition-colors duration-200" id="headerCoreBrandLink" onclick="showMainSection('core-brand-landing-page')">Core Brand</a>
            <a href="javascript:void(0)" class="header-nav-item transition-colors duration-200" onclick="showMainSection('shareprice')">Signal</a>
            <a href="javascript:void(0)" class="header-nav-item transition-colors duration-200" onclick="showMainSection('vault-access')">Vault</a>
            <a href="javascript:void(0)" class="header-nav-item transition-colors duration-200" onclick="showMainSection('treaty')">Treaty</a>
            <a href="javascript:void(0)" class="header-nav-item transition-colors duration-200" onclick="showMainSection('vaultmesh')">VaultMesh™</a>
            <a href="javascript:void(0)" class="header-nav-item transition-colors duration-200" onclick="showMainSection('about')">About</a>
            <a href="javascript:void(0)" class="header-nav-item px-4 py-2 rounded-full font-semibold transition-colors duration-200 header-sign-up" onclick="showMainSection('sign-up-section')">Sign Up</a>
            <a href="javascript:void(0)" class="header-nav-item transition-colors duration-200" onclick="showMainSection('sign-in-section')">Sign In</a>
            <a href="javascript:void(0)" class="header-nav-item transition-colors duration-200" onclick="showMainSection('fruitful-dashboard-wrapper')">Dashboard</a>
            <!-- New: Sector Index dropdown -->
            <div class="relative group">
                <button class="header-nav-item transition-colors duration-200 focus:outline-none flex items-center">
                    Sector Index <i class="fas fa-chevron-down ml-2 text-xs"></i>
                </button>
                <div id="sectorDropdown" class="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg py-2 hidden group-hover:block transition-all duration-300 ease-out transform scale-y-0 origin-top opacity-0">
                    <!-- Sector links will be dynamically populated here -->
                </div>
            </div>
        </nav>
    </header>

    <!-- Landing Page Sections -->
    <section id="hero-section" class="landing-section text-center">
        <div class="hero-content">
            <h2 class="text-5xl md:text-6xl font-extrabold mb-6 leading-tight" id="heroHeadline">
                Innovate. Connect. <span class="dynamic-accent-text">Thrive.</span>
            </h2>
            <p class="text-xl md:text-2xl mb-10 max-w-2xl mx-auto" id="heroSubtitle">
                Discover a new era of collaboration and sustainable growth with Fruitful™'s cutting-edge platform.
            </p>
            <a href="javascript:void(0)" class="cta-button" id="heroCtaButton" onclick="showMainSection('cta-landing')">
                Get Started Today <span>🚀</span>
            </a>
        </div>
    </section>

    <!-- New: Direct Dashboard Access Button for Development -->
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <button onclick="showMainSection('fruitful-dashboard-wrapper')"
                class="px-6 py-3 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-700 transition duration-300 transform hover:scale-105 flex items-center space-x-2">
            <i class="fas fa-tachometer-alt"></i> <span>Go to Dashboard (Dev Access)</span>
        </button>
    </div>


    <section id="features" class="landing-section py-16 md:py-24 px-6 md:px-12 text-center">
        <div class="max-w-6xl mx-auto">
            <h3 class="text-4xl font-bold text-center mb-16" id="featuresTitle">
                Unlock Your Potential with Our Core Features
            </h3>
            <div id="featuresGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Feature cards will be dynamically loaded here -->
            </div>
        </div>
    </section>

    <!-- Featured Core Brand Section (Dynamically rendered) -->
    <section id="featured-core-brand-section" class="landing-section featured-core-brand-section">
        <h2 id="featuredCoreBrandTitle">✨ Featured Core Brand: Fruitful Innovations™ ✨</h2>
        <p id="featuredCoreBrandDescription">
            This section dynamically highlights the core brand for the selected sector.
        </p>
        <p id="featuredCoreBrandSubDescription">
            Learn about its mission, unique value proposition, and how it contributes to the Fruitful™ ecosystem.
        </p>
        <a href="javascript:void(0)" class="cta-button" id="featuredCoreBrandCtaButton" onclick="showMainSection('core-brand-landing-page')">
            Discover Brand <i class="fas fa-arrow-right"></i>
        </a>
    </section>

    <section id="shareprice" class="landing-section py-12 text-center">
        <h2 class="text-3xl font-semibold mb-2">FAA™ Share Signal</h2>
        <div id="price" class="text-5xl font-bold">$88.88</div>
        <div class="text-sm text-gray-400 mt-1">Last updated: <span id="timestamp">Live</span></div>
    </section>

    <section id="seedwave" class="landing-section py-16 px-6 text-center">
        <h2 class="text-4xl font-bold mb-8">🌱 Seedwave™ Brand Growth 🌱</h2>
        <div class="w-full max-w-4xl mx-auto p-6 rounded-xl shadow-lg">
            <canvas id="brandChart"></canvas>
        </div>
    </section>

    <section id="founder-glyph" class="landing-section py-16 px-6 text-center bg-gray-700">
        <h2 class="text-4xl font-bold mb-6">🧬 Founder's Glyph™</h2>
        <p class="max-w-3xl mx-auto text-xl leading-relaxed">
            FAA™ wasn’t built like a typical startup. It emerged — out of silence, out of signal, out of glyphs and patterns that refused to be ignored.
            What you're seeing isn't a site. It’s a vault interface. A codebase of culture. A trust-machine powered by real human intelligence.
        </p>
        <p class="mt-6 max-w-2xl mx-auto italic">
            Where others scale with speed, we scale with meaning. Every brand here agreed to something deeper than growth — they signed a Treaty.
            That’s why this isn’t eCommerce. It’s TreatyCommerce™.
        </p>
        <p class="mt-6 font-semibold">— Written from the edge of code & culture 🌍 FAA.Zone™ Founder Glyph Activated™</p>
    </section>

    <section id="vault-access" class="landing-section py-16 px-6">
        <h3 class="text-4xl font-bold text-center mb-10">🔐 Sector Terminals</h3>

        <div class="w-full max-w-6xl mx-auto mb-10">
            <div class="w-full h-[800px] border-4 rounded-xl shadow-2xl overflow-hidden">
                <iframe
                    id="vault-frame"
                    src=""
                    class="w-full h-full rounded-xl"
                    frameborder="0"
                    title="VaultMaster Terminal"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                ></iframe>
            </div>
        </div>

        <div id="terminalButtons" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <!-- Terminal buttons will be dynamically loaded here -->
        </div>
    </section>

    <section id="sector-scrolls" class="landing-section py-16 px-6 text-center bg-gray-800">
        <h2 class="text-4xl font-bold mb-8">🧬 Sector Scrolls</h2>
        <div id="sectorGlyphGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <!-- Sector glyphs will be dynamically loaded here -->
        </div>
    </section>

    <div id="sector-content-container" class="mt-10 px-6 max-w-6xl mx-auto">
        <!-- Dynamic sector content will be loaded here -->
        <!-- These hidden sections are placeholders for showSectorPanel -->
        <div id="embedded-payroll-snapshot" class="brand-snapshot hidden"></div>
        <div id="embedded-retail-snapshot" class="brand-snapshot hidden"></div>
        <div id="embedded-ai-logic-snapshot" class="brand-snapshot hidden"></div>
        <div id="embedded-design-snapshot" class="brand-snapshot hidden"></div>
        <div id="embedded-finance-snapshot" class="brand-snapshot hidden"></div>
        <div id="embedded-webless-snapshot" class="brand-snapshot hidden"></div>
        <div id="embedded-logistics-snapshot" class="brand-snapshot hidden"></div>
        <div id="embedded-food-snapshot" class="brand-snapshot hidden"></div>
        <div id="embedded-education-snapshot" class="brand-snapshot hidden"></div>
        <div id="embedded-health-snapshot" class="brand-snapshot hidden"></div>
        <div id="embedded-culture-snapshot" class="brand-snapshot hidden"></div>
        <div id="embedded-housing-snapshot" class="brand-snapshot hidden"></div>
        <div id="embedded-nft-snapshot" class="brand-snapshot hidden"></div>
        <div id="embedded-media-snapshot" class="brand-snapshot hidden"></div>
        <div id="embedded-mining-snapshot" class="brand-snapshot hidden"></div>
        <div id="embedded-wildlife-snapshot" class="brand-snapshot hidden"></div>
    </div>


    <section id="treaty" class="landing-section py-16 px-6 text-center">
        <h2 class="text-4xl font-bold mb-6">📜 Treaty System™</h2>
        <p class="max-w-2xl mx-auto text-lg mb-8">The FAA™ Treaty Layer binds interface to intention. This is not UI. This is glyph-encoded law.</p>
        <blockquote class="text-2xl italic font-semibold">"FAA™ isn't a site. It's the shape of alignment — and 🦍 holds the flame."</blockquote>
    </section>

    <section id="signal-packet" class="landing-section py-10 text-xs text-center">
        <pre class="max-w-2xl mx-auto p-4 rounded-lg overflow-auto"><code>{
    "signal": "omnidrop",
    "origin": "If you dont like the fruits you are growing, change the seed™ / FAA™ Vault Layer",
    "payload": {
        "type": "scroll",
        "value": "homepage + VaultRouter + all terminal iframe buttons live + Treaty Grid"
    }
}</code></pre>
    </section>

    <section id="vaultmesh" class="landing-section py-20 px-6">
        <div class="max-w-4xl mx-auto text-left space-y-6">

            <h2 class="text-4xl font-bold">🧠 VaultMesh™: Executive Summary</h2>

            <p>VaultMesh™ is an intelligent data orchestration framework designed for the segmentation, synchronization, and secure deployment of high-value digital assets—referred to as scrolls—across decentralized and permissioned networks such as FAA.Zone™.</p>

            <ul class="list-disc ml-6 space-y-2">
                <li>Captures metadata-rich content streams (chats, code, brands, assets)</li>
                <li>Assigns them to programmable claim structures (ScrollClaims™)</li>
                <li>Secures their lineage using OmniSignal™, PulseGrid™, and GhostTrace™ layers</li>
                <li>Enforces royalty logic, scroll integrity, and traceability on-chain and off-grid</li>
            </ul>

            <p>VaultMesh™ powers high-tier operations like HSOMNI9000™, enabling Diamond-tier deployments, cross-sector scroll claims, and enterprise-scale content monetization with full compliance and provenance.</p>

            <p>The framework is deeply integrated with platforms such as <code>vault.faa.zone™</code>, where scrolls tied to brands like Fruitful Global Planet™ are securely hosted, organized into structured sectors, and deployed through FAA.Zone™-compliant channels.</p>

            <p>A critical operator in this ecosystem is HSOMNI9000™, the certified scroll class which governs Diamond-tier logic, enforces 10–11% royalty triggers, and auto-deploys ScrollClaims™ with real-time ClaimRoot™ verification.</p>

            <h3 class="text-2xl font-semibold mt-10">📖 VaultMesh™ Index</h3>
            <ul class="list-decimal ml-6 space-y-1">
                <li>Introduction to VaultMesh™</li>
                <li>Core System Components</li>
                <li>ScrollClaim™ Infrastructure</li>
                <li>Data Flow and Claim Lifecycle</li>
                <li>Tiering, Royalties, and Compliance</li>
                <li>Integration with FAA.Zone™</li>
                <li>Market Segments & Use Cases</li>
                <li>Revenue Streams & Monetization</li>
                <li>Technology Roadmap</li>
                <li>Team & Governance</li>
            </ul>

            <h3 class="text-xl font-bold mt-10">☑️ 1. Introduction to VaultMesh™</h3>
            <p>VaultMesh™ transforms disorganized digital content into claimable, trackable assets. It bridges enterprise content systems, decentralized data vaults, and monetization layers through FAA™-compliant infrastructure.</p>

            <h3 class="text-xl font-bold mt-10">⚒️ 2. Core System Components</h3>
            <ul class="list-disc ml-6 space-y-1">
                <li>VaultDNA™: Immutable identifiers for scroll content</li>
                <li>ClaimRoot™: Origin anchor & timestamp</li>
                <li>ScrollClaim™ Contracts: Programmable wrappers</li>
                <li>PulseGrid™ Sync: Real-time scroll presence & sync</li>
                <li>OmniSignal™: Global scroll verification</li>
                <li>GhostTrace™ Gen2: Scroll interaction backtrace</li>
            </ul>

            <h3 class="text-xl font-bold mt-10">🛠️ 3. ScrollClaim™ Infrastructure</h3>
            <ul class="list-disc ml-6 space-y-1">
                <li>Set tier access (e.g., Diamond)</li>
                <li>Define royalty logic (10–11%)</li>
                <li>Lock scrolls with PulseGrid™ sync and OmniSignal™</li>
                <li>Deploy via FAA.Zone™ with compliant ZIP bundles</li>
            </ul>

            <h3 class="text-xl font-bold mt-10">📀 4. Data Flow and Claim Lifecycle</h3>
            <ul class="list-decimal ml-6 space-y-1">
                <li>Ingest — content enters VaultMesh™</li>
                <li>Encode — metadata & VaultDNA™ attached</li>
                <li>Wrap — ScrollClaim™ smart-wrapped</li>
                <li>Deploy — FAA.Zone™ push (ZIP, manifest, HTML)</li>
                <li>Sync — PulseGrid™ status & OmniSignal™ locked</li>
                <li>Enforce — Royalties, access & scroll activity logged via GhostTrace™</li>
            </ul>

            <h3 class="text-xl font-bold mt-10">💸 5. Tiering, Royalties, and Compliance</h3>
            <ul class="list-disc ml-6 space-y-1">
                <li>Diamond Tier: 10–11% royalty enforced</li>
                <li>SmartWallet Integration: ScrollClaim™ payments and transfers</li>
                <li>VaultPay™ Tier III: Required for commercial deployments</li>
                <li>Compliance: FAA™ scroll ID, ClaimRoot™ hash, and royalty schema</li>
            </ul>

            <h3 class="text-xl font-bold mt-10">📡 6. Integration with FAA.Zone™</h3>
            <ul class="list-disc ml-6 space-y-1">
                <li>Native support for /public/diamond/ structure</li>
                <li>ZIP, HTML, Manifest deployment bundles</li>
                <li>ClaimRoot™ timestamp validation</li>
                <li>Seamless PulseGrid™ auto-sync for live claim state</li>
                <li>Brand hosting via vault.faa.zone™</li>
            </ul>

            <h3 class="text-xl font-bold mt-10">🏢 7. Market Segments & Use Cases</h3>
            <ul class="list-disc ml-6 space-y-1">
                <li>GPT Conversations & Expert Threads</li>
                <li>Knowledge/Training Archives</li>
                <li>Creative IP Scrolls (music, literature, visuals)</li>
                <li>GeoSector Deployment Archives</li>
                <li>Enterprise Scroll Logs & Audit Trails</li>
            </ul>

            <h3 class="text-xl font-bold mt-10">💰 8. Revenue Streams & Monetization</h3>
            <ul class="list-disc ml-6 space-y-1">
                <li>Diamond Royalties (10–11%)</li>
                <li>Scroll Packaging Fees</li>
                <li>VaultMesh™ API Subscriptions</li>
                <li>PulseGrid™ and OmniSignal™ Licensing</li>
            </ul>

            <h3 class="text-xl font-bold mt-10 text-white">⚖️ 9. Technology Roadmap</h3>
            <ul class="list-disc ml-6 space-y-1">
                <li>Q2 2025: ScrollClaim™ v2.2 with multi-claim staking</li>
                <li>Q3 2025: GhostTrace™ Gen3 with forensic backtrace tooling</li>
                <li>Q4 2025: Autonomous AI™ Sector Agents</li>
                <li>Q1 2026: Inter-vault Federation</li>
            </ul>

            <h3 class="text-xl font-bold mt-10">🔧 10. Team & Governance</h3>
            <ul class="list-disc ml-6 space-y-1">
                <li>FAA™-certified engineers (scroll claimers)</li>
                <li>Scroll Ministers: Compliance + tiering</li>
                <li>Vault Admins: Metadata + ClaimRoot™ enforcement</li>
                <li>HSOMNI9000™ Operators: Diamond-tier execution agents</li>
            </ul>

            <p class="text-sm mt-10">📎 This plan can now be exported as HTML, PDF, or ZIP.</p>
        </div>
    </section>

    <section id="about" class="landing-section py-16 md:py-24 px-6 md:px-12 text-center">
        <div class="max-w-4xl mx-auto">
            <h3 class="text-4xl font-bold mb-8">About Fruitful Innovations™</h3>
            <p class="text-lg leading-relaxed mb-6">
                At Fruitful™, we believe in a future where technology empowers positive change. Our platform is designed to break down traditional barriers, fostering a collaborative ecosystem where businesses and individuals can thrive while making a meaningful impact on the world.
            </p>
            <p class="text-lg leading-relaxed">
                We are committed to transparency, sustainability, and innovation, driven by a powerful AI™ that ensures fairness, efficiency, and personalized experiences for every user. Join us in building a more fruitful planet.
            </p>
        </div>
    </section>

    <section id="cta-landing" class="landing-section py-16 md:py-24 px-6 md:px-12 text-center">
        <div class="max-w-3xl mx-auto">
            <h3 class="text-4xl font-extrabold mb-8 leading-tight">
                Ready to Transform Your Future?
            </h3>
            <p class="text-xl mb-10">
                Join the Fruitful™ community today and start your journey towards innovation, connection, and a sustainable tomorrow.
            </p>
            <a href="javascript:void(0)" class="cta-button" onclick="showMainSection('sign-up-section')">
                Sign Up Now
            </a>
        </div>
    </section>

    <!-- Core Brand Landing Page Content (Dynamic) -->
    <section id="core-brand-landing-page" class="hidden content-section">
        <canvas id="core-brand-canvas"></canvas>
        <div class="core-brand-hero-content">
            <h1 id="coreBrandHeadline">Core Brand: <br> <span id="coreBrandSlogan">Kind Creatures. Global Impact.</span></h1>
            <p id="coreBrandDescriptionHero">
                Discover this brand's world of thoughtful essentials & innovative solutions. For every purchase, we deliver the same item to a child in need, identified by the Baobab Security Network™'s data-driven insights.
            </p>
            <div class="button-container flex flex-wrap justify-center gap-4 mt-6">
                <a href="javascript:void(0)" class="cta-button core-brand-cta-button" id="coreBrandExploreButton">
                    Explore Brand World <i class="fas fa-arrow-right"></i>
                </a>
                <a href="javascript:void(0)" target="_blank" class="cta-button core-brand-cta-button" id="coreBrandShopButton">
                    Shop Now <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- Sign In Section (New) -->
    <section id="sign-in-section" class="landing-section hidden py-16 md:py-24 px-6 md:px-12 text-center">
        <div class="auth-form-container">
            <h2>Sign In to Your Fruitful™ Account</h2>
            <form id="signInForm" onsubmit="event.preventDefault(); handleSignIn();">
                <label for="signInEmail">Email Address</label>
                <input type="email" id="signInEmail" placeholder="your.email@example.com" required>

                <label for="signInPassword">Password</label>
                <input type="password" id="signInPassword" placeholder="********" required>

                <button type="submit">Sign In</button>
            </form>
            <p class="text-center mt-6 text-sm text-gray-400">
                Don't have an account? <a href="javascript:void(0)" onclick="showMainSection('sign-up-section')">Sign Up Here</a>
            </p>
            <div id="signInMessage" class="mt-4 text-red-400"></div>
        </div>
    </section>

    <!-- Sign Up Section (New) -->
    <section id="sign-up-section" class="landing-section hidden py-16 md:py-24 px-6 md:px-12 text-center">
        <div class="auth-form-container">
            <h2>Create Your Fruitful™ Account</h2>
            <form id="signUpForm" onsubmit="event.preventDefault(); handleSignUp();">
                <label for="signUpName">Full Name</label>
                <input type="text" id="signUpName" placeholder="John Doe" required>

                <label for="signUpEmail">Email Address</label>
                <input type="email" id="signUpEmail" placeholder="your.email@example.com" required>

                <label for="signUpPassword">Password</label>
                <input type="password" id="signUpPassword" placeholder="********" required>

                <label for="signUpConfirmPassword">Confirm Password</label>
                <input type="password" id="signUpConfirmPassword" placeholder="********" required>

                <button type="submit">Sign Up</button>
            </form>
            <p class="text-center mt-6 text-sm text-gray-400">
                Already have an account? <a href="javascript:void(0)" onclick="showMainSection('sign-in-section')">Sign In Here</a>
            </p>
            <div id="signUpMessage" class="mt-4 text-red-400"></div>
        </div>
    </section>


    <!-- Fruitful Dashboard Content (initially hidden) -->
    <div id="fruitful-dashboard-wrapper" class="hidden flex-grow main-content-bg">
        <div class="flex flex-grow dashboard-container">
            <nav class="dashboard-sidebar-bg dashboard-sidebar">
                <h2 class="text-xl font-semibold dashboard-primary-text mb-4">Dashboard</h2>
                <a href="javascript:void(0)" class="dashboard-sidebar-nav-item" onclick="showDashboardSection('overview')">
                    <i class="fas fa-tachometer-alt"></i> Sector Overview
                </a>
                <a href="javascript:void(0)" class="dashboard-sidebar-nav-item" onclick="showDashboardSection('core-brand-dashboard-panel')">
                    <i class="fas fa-gem"></i> Core Brand Details
                </a>
                <a href="javascript:void(0)" class="dashboard-sidebar-nav-item" onclick="showDashboardSection('sub-node-index')">
                    <i class="fas fa-network-wired"></i> Sub-Node Index
                </a>
                <a href="javascript:void(0)" class="dashboard-sidebar-nav-item" onclick="showDashboardSection('analytics')">
                    <i class="fas fa-chart-line"></i> Data Analytics
                </a>
                <a href="javascript:void(0)" class="dashboard-sidebar-nav-item" onclick="showDashboardSection('admin-panel')">
                    <i class="fas fa-users-cog"></i> Admin Panel
                </a>
                <a href="javascript:void(0)" class="dashboard-sidebar-nav-item" onclick="showDashboardSection('music')">
                    <i class="fas fa-music"></i> Music & Media
                </a>
                <a href="javascript:void(0)" class="dashboard-sidebar-nav-item" onclick="showDashboardSection('ai-gemini')">
                    <i class="fas fa-robot"></i> AI Gemini™
                </a>
                <a href="javascript:void(0)" class="dashboard-sidebar-nav-item" onclick="showDashboardSection('maps')">
                    <i class="fas fa-map-marked-alt"></i> Maps
                </a>
                <a href="javascript:void(0)" class="dashboard-sidebar-nav-item" onclick="showDashboardSection('meeting-minutes')">
                    <i class="fas fa-clipboard-list"></i> Meeting Minutes
                </a>
                <a href="javascript:void(0)" class="dashboard-sidebar-nav-item" onclick="showDashboardSection('settings')">
                    <i class="fas fa-cog"></i> Settings
                </a>
            </nav>

            <main class="flex-grow p-8 dashboard-main-content-bg overflow-y-auto dashboard-main-content">
                <div class="flex h-full dashboard-main-content-wrapper">
                    <nav id="musicSubSidebar" class="dashboard-sidebar-bg music-sub-sidebar hidden">
                        <h3 class="text-lg font-semibold dashboard-primary-text mb-3">Music Library</h3>
                        <a href="javascript:void(0)" class="dashboard-sidebar-nav-item" onclick="showMusicSubSection('allMusic')">
                            <i class="fas fa-compact-disc"></i> All Music
                        </a>
                        <a href="javascript:void(0)" class="dashboard-sidebar-nav-item" onclick="showMusicSubSection('musicPlaylists')">
                            <i class="fas fa-list-music"></i> Playlists
                        </a>
                        <a href="javascript:void(0)" class="dashboard-sidebar-nav-item" onclick="showMusicSubSection('artists')">
                            <i class="fas fa-microphone-alt"></i> Artists
                        </a>
                    </nav>

                    <div class="flex-grow">
                        <section id="overview" class="mb-8 dashboard-card">
                            <h2 class="text-3xl font-bold dashboard-primary-text mb-6" id="dashboardOverviewTitle">Sector Overview</h2>
                            <p class="dashboard-muted-text mb-4" id="dashboardOverviewDescription">
                                This section provides an overview of your personalized Fruitful Global™ data.
                                In a live system, these values would dynamically reflect your account's activity and metrics.
                            </p>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div class="dashboard-sub-card">
                                    <h3 class="text-xl font-semibold dashboard-text-light mb-2">Total Users</h3>
                                    <p class="text-4xl font-bold dashboard-primary-text">[Your Total Users]</p>
                                </div>
                                <div class="dashboard-sub-card">
                                    <h3 class="text-xl font-semibold dashboard-text-light mb-2">Active Projects</h3>
                                    <p class="text-4xl font-bold dashboard-secondary-text">[Your Active Projects]</p>
                                </div>
                                <div class="dashboard-sub-card">
                                    <h3 class="text-xl font-semibold dashboard-text-light mb-2">Data Processed (TB)</h3>
                                    <p class="text-4xl font-bold text-teal-400">[Your Data Processed (TB)]</p>
                                </div>
                            </div>
                            <div class="mt-8">
                                <h3 class="text-2xl font-semibold dashboard-text-light mb-4">Quick Stats</h3>
                                <ul class="list-disc list-inside dashboard-muted-text space-y-2">
                                    <li>Daily Active Users: [Your DAU]</li>
                                    <li>New Registrations This Week: [Your Weekly Registrations]</li>
                                    <li>Average Session Duration: [Your Avg Session Duration] min</li>
                                    <li>System Uptime: 99.9%</li>
                                </ul>
                            </div>
                        </section>

                        <!-- New Core Brand Dashboard Panel -->
                        <section id="core-brand-dashboard-panel" class="hidden mb-8 dashboard-card">
                            <h2 class="text-3xl font-bold dashboard-primary-text mb-6" id="coreBrandDashboardTitle">Core Brand: Fruitful Innovations™</h2>
                            <div class="flex flex-col md:flex-row items-center gap-6 mb-8">
                                <i id="coreBrandDashboardIcon" class="text-6xl text-purple-400"></i>
                                <div>
                                    <h3 class="text-2xl font-semibold dashboard-text-light" id="coreBrandDashboardName">Fruitful Innovations™</h3>
                                    <p class="dashboard-muted-text" id="coreBrandDashboardSlogan">The original spirit of progress.</p>
                                </div>
                            </div>
                            <p class="dashboard-muted-text mb-6" id="coreBrandDashboardDescription">
                                This panel provides a detailed overview of the core brand for the currently selected sector.
                                It includes its mission, key functionalities, and its overall contribution to the Fruitful™ ecosystem.
                            </p>
                            <h4 class="text-xl font-semibold dashboard-text-light mb-3">Key Highlights:</h4>
                            <ul id="coreBrandDashboardHighlights" class="list-disc list-inside dashboard-muted-text space-y-2 ml-4">
                                <!-- Dynamically populated highlights -->
                            </ul>
                            <div class="mt-6 text-center">
                                <a href="javascript:void(0)" id="coreBrandDashboardCta" class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200">
                                    Visit Core Brand Site <i class="fas fa-external-link-alt ml-2"></i>
                                </a>
                            </div>
                        </section>

                        <!-- New Sub-Node Index Dashboard Panel -->
                        <section id="sub-node-index" class="hidden mb-8 dashboard-card">
                            <h2 class="text-3xl font-bold dashboard-primary-text mb-6" id="subNodeIndexTitle">Sub-Node Index: Fruitful Innovations™</h2>
                            <p class="dashboard-muted-text mb-4" id="subNodeIndexDescription">
                                Explore the various sub-nodes and specialized entities that operate within this sector, providing granular functionalities and services.
                            </p>
                            <div id="subNodeGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <!-- Sub-node cards will be dynamically loaded here -->
                            </div>

                            <!-- New: Sub-Node Details Display Area -->
                            <div id="subNodeDetailsContainer" class="mt-8 dashboard-card hidden">
                                <h3 id="subNodeDetailTitle" class="text-2xl font-bold dashboard-primary-text mb-4"></h3>
                                <p id="subNodeDetailDescription" class="dashboard-muted-text mb-4"></p>
                                <div id="subNodeDetailContent">
                                    <!-- Dynamic content based on sub-node will go here -->
                                </div>
                                <button onclick="hideSubNodeDetails()" class="mt-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200">
                                    <i class="fas fa-arrow-left mr-2"></i> Back to Sub-Nodes
                                </button>
                            </div>
                        </section>

                        <section id="analytics" class="hidden mb-8 dashboard-card">
                            <h2 class="text-3xl font-bold dashboard-primary-text mb-6">Data Analytics</h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 grid-cols-2-md">
                                <div class="dashboard-sub-card">
                                    <h3 class="text-xl font-semibold dashboard-text-light mb-2">Usage Trends</h3>
                                    <p class="dashboard-muted-text">Graph showing daily user activity and data consumption.</p>
                                    <div class="mt-4 bg-gray-800 h-48 flex items-center justify-center rounded-md">
                                        <span class="dashboard-muted-text">Placeholder Chart</span>
                                    </div>
                                </div>
                                <div class="dashboard-sub-card">
                                    <h3 class="text-xl font-semibold dashboard-text-light mb-2">Performance Metrics</h3>
                                    <p class="dashboard-muted-text">Key performance indicators over time.</p>
                                    <div class="mt-4 bg-gray-800 h-48 flex items-center justify-center rounded-md">
                                        <span class="dashboard-muted-text">Placeholder Chart</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="admin-panel" class="hidden mb-8 dashboard-card">
                            <h2 class="text-3xl font-bold dashboard-primary-text mb-6">Admin Panel</h2>
                            <p class="dashboard-muted-text mb-4">
                                Manage users, review content, and configure system settings.
                                In a live environment, this table would display details specific to your administrative scope.
                            </p>

                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                <div class="dashboard-sub-card">
                                    <h3 class="text-xl font-semibold dashboard-text-light mb-2">Total Active Admins</h3>
                                    <p class="text-4xl font-bold dashboard-secondary-text">[Your Admin Count]</p>
                                </div>
                                <div class="dashboard-sub-card">
                                    <h3 class="text-xl font-semibold dashboard-text-light mb-2">Pending Approvals</h3>
                                    <p class="text-4xl font-bold text-yellow-400">[Your Pending Approvals]</p>
                                </div>
                                <div class="dashboard-sub-card">
                                    <h3 class="text-xl font-semibold dashboard-text-light mb-2">System Health</h3>
                                    <p class="text-4xl font-bold text-green-400">Optimal</p>
                                </div>
                            </div>

                            <h3 class="text-2xl font-semibold dashboard-text-light mb-4">User Management</h3>
                            <div class="flex flex-col md:flex-row gap-4 mb-6">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    class="flex-grow px-4 py-2 rounded-lg bg-gray-700 border dashboard-border-dark dashboard-text-light placeholder-dashboard-muted-text focus:outline-none focus:ring-2 focus:ring-primary-color"
                                >
                                <select class="px-4 py-2 rounded-lg bg-gray-700 border dashboard-border-dark dashboard-text-light focus:outline-none focus:ring-2 focus:ring-primary-color">
                                    <option value="">Filter by Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    <option value="moderator">Moderator</option>
                                </select>
                                <button class="px-4 py-2 bg-primary-color text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200">Apply Filters</button>
                            </div>
                            <div class="overflow-x-auto mb-8">
                                <table class="min-w-full bg-gray-700 rounded-lg shadow-md">
                                    <thead>
                                        <tr>
                                            <th class="py-3 px-4 text-left text-sm font-semibold dashboard-muted-text uppercase tracking-wider border-b dashboard-border-dark">User ID</th>
                                            <th class="py-3 px-4 text-left text-sm font-semibold dashboard-muted-text uppercase tracking-wider border-b dashboard-border-dark">Name</th>
                                            <th class="py-3 px-4 text-left text-sm font-semibold dashboard-muted-text uppercase tracking-wider border-b dashboard-border-dark">Email</th>
                                            <th class="py-3 px-4 text-left text-sm font-semibold dashboard-muted-text uppercase tracking-wider border-b dashboard-border-dark">Role</th>
                                            <th class="py-3 px-4 text-left text-sm font-semibold dashboard-muted-text uppercase tracking-wider border-b dashboard-border-dark">Status</th>
                                            <th class="py-3 px-4 text-left text-sm font-semibold dashboard-muted-text uppercase tracking-wider border-b dashboard-border-dark">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="hover:bg-gray-600 transition duration-200">
                                            <td class="py-3 px-4 border-b dashboard-border-dark">[Your User ID]</td>
                                            <td class="py-3 px-4 border-b dashboard-border-dark">[Your Name]</td>
                                            <td class="py-3 px-4 border-b dashboard-border-dark">[Your Email]</td>
                                            <td class="py-3 px-4 border-b dashboard-border-dark">[Your Role]</td>
                                            <td class="py-3 px-4 border-b dashboard-border-dark"><span class="bg-green-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">[Your Status]</span></td>
                                            <td class="py-3 px-4 border-b dashboard-border-dark">
                                                <button class="text-blue-400 hover:text-blue-300 mr-2">Edit</button>
                                                <button class="text-red-400 hover:text-red-300">Delete</button>
                                            </td>
                                        </tr>
                                        <tr class="hover:bg-gray-600 transition duration-200">
                                            <td class="py-3 px-4 border-b dashboard-border-dark">FRTL-XXX</td>
                                            <td class="py-3 px-4 border-b dashboard-border-dark">Mock User</td>
                                            <td class="py-3 px-4 border-b dashboard-border-dark">mock@example.com</td>
                                            <td class="py-3 px-4 border-b dashboard-border-dark">User</td>
                                            <td class="py-3 px-4 border-b dashboard-border-dark"><span class="bg-yellow-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">Pending</span></td>
                                            <td class="py-3 px-4 border-b dashboard-border-dark">
                                                <button class="text-blue-400 hover:text-blue-300 mr-2">Edit</button>
                                                <button class="text-red-400 hover:text-red-300">Delete</button>
                                            </td>
                                        </tr>
                                        </tbody>
                                </table>
                            </div>

                            <h3 class="text-2xl font-semibold dashboard-text-light mb-4">Admin Assistant (AI Powered)</h3>
                            <p class="dashboard-muted-text mb-3">Ask Gemini AI™ for insights on administrative tasks, user trends, or content moderation advice.</p>
                            <textarea id="adminAIPrompt" rows="4" class="w-full p-3 rounded-lg bg-gray-700 border dashboard-border-dark dashboard-text-light placeholder-dashboard-muted-text focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="e.g., 'Summarize recent user activity trends for the past week.', 'Suggest a policy for handling spam content.'"></textarea>
                            <button id="sendAdminAIPrompt" class="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition duration-200 mt-4 self-end">
                                Ask Admin Assistant
                            </button>
                            <div class="mt-4 p-4 bg-gray-700 rounded-lg border dashboard-border-dark">
                                <h4 class="text-lg font-semibold dashboard-text-light mb-2">Admin Assistant Response:</h4>
                                <div id="adminAIResponse" class="dashboard-text-light whitespace-pre-wrap">
                                    Your AI™-powered admin assistant response will appear here.
                                </div>
                                <div id="adminAIError" class="text-red-400 mt-2 hidden"></div>
                            </div>

                        </section>

                        <section id="music" class="hidden mb-8 dashboard-card flex-grow music-content-area">
                            <h2 class="text-3xl font-bold dashboard-primary-text mb-6">Music & Media</h2>
                            <p class="dashboard-muted-text text-center mb-6">Explore curated music and media content from our partners.</p>

                            <div id="allMusicContent" class="flex flex-col items-center justify-center space-y-6">
                                <h3 class="text-xl font-semibold dashboard-text-light mb-2">All Music Tracks</h3>
                                <div class="w-full max-w-xl">
                                    <h4 class="text-lg font-semibold dashboard-text-light mb-2">Album: The Fated Sky</h4>
                                    <iframe style="border-radius:12px" src="https://open.spotify.com/embed/album/3RyjFxsU9hcmg14vqzUUMy?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                                </div>

                                <div class="w-full max-w-xl">
                                    <h4 class="text-lg font-semibold dashboard-text-light mb-2">Track: No Reason</h4>
                                    <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/2kdQY3b6dDRGonyIzcWljc?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                                </div>

                                <div class="w-full max-w-xl">
                                    <h4 class="text-lg font-semibold dashboard-text-light mb-2">Track: Space Song</h4>
                                    <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/6Xe9wT5xeZETPwtaP2ynUz?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                                </div>
                            </div>

                            <div id="musicPlaylistsContent" class="hidden">
                                <h3 class="text-xl font-semibold dashboard-text-light mb-4">Your Music Playlists</h3>
                                <ul class="list-disc list-inside dashboard-muted-text space-y-2">
                                    <li>Fruitful™ Focus Playlist</li>
                                    <li>Deep Work Rhythms</li>
                                    <li>Relax & Grow Collection</li>
                                </ul>
                            </div>

                            <div id="artistsContent" class="hidden">
                                <h3 class="text-xl font-semibold dashboard-text-light mb-4">Featured Artists</h3>
                                <ul class="list-disc list-inside dashboard-muted-text space-y-2">
                                    <li>Artist A - Genre: Ambient</li>
                                    <li>Artist B - Genre: Lo-Fi</li>
                                    <li>Artist C - Genre: Classical</li>
                                </ul>
                            </div>
                        </section>

                        <section id="ai-gemini" class="hidden mb-8 dashboard-card">
                            <h2 class="text-3xl font-bold dashboard-primary-text mb-6">AI Gemini™ Integration</h2>
                            <p class="dashboard-muted-text mb-4">Interact with the Gemini AI™ model directly from your dashboard.</p>

                            <div class="api-key-warning mb-4">
                                <strong>Security Alert!</strong> For production, never expose your API key directly in client-side code. Use a backend server to proxy your AI requests.
                            </div>

                            <!-- General Gemini Prompt -->
                            <div class="mb-8">
                                <h3 class="text-xl font-semibold dashboard-text-light mb-3">General Query ✨</h3>
                                <textarea id="geminiPrompt" rows="4" class="w-full p-3 rounded-lg bg-gray-700 border dashboard-border-dark dashboard-text-light placeholder-dashboard-muted-text focus:outline-none focus:ring-2 focus:ring-primary-color" placeholder="Enter your prompt for Gemini AI™ here... (e.g., 'Explain how AI works in a few words', 'Write a short poem about fruit.')"></textarea>
                                <button id="sendGeminiPrompt" class="px-6 py-3 bg-primary-color text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200 mt-4 self-end">
                                    Send to Gemini™
                                </button>
                                <div class="mt-4 p-4 bg-gray-700 rounded-lg border dashboard-border-dark">
                                    <h4 class="text-lg font-semibold dashboard-text-light mb-2">Gemini AI™ Response:</h4>
                                    <div id="geminiResponse" class="dashboard-text-light whitespace-pre-wrap">
                                        Type a general prompt and click "Send to Gemini™" to get a response.
                                    </div>
                                    <div id="geminiError" class="text-red-400 mt-2 hidden"></div>
                                </div>
                            </div>

                            <!-- Coding Partner Feature -->
                            <div class="mb-8">
                                <h3 class="text-xl font-semibold dashboard-text-light mb-3">Coding Partner ✨</h3>
                                <p class="dashboard-muted-text mb-3">Get explanations for code, generate snippets, or debug issues.</p>
                                <textarea id="codingPrompt" rows="6" class="w-full p-3 rounded-lg bg-gray-700 border dashboard-border-dark dashboard-text-light placeholder-dashboard-muted-text focus:outline-none focus:ring-2 focus:ring-secondary-color" placeholder="e.g., 'Explain this Python code: def factorial(n): ...', or 'Write a JavaScript function to sort an array.'"></textarea>
                                <button id="sendCodingPrompt" class="px-6 py-3 bg-secondary-color text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200 mt-4 self-end">
                                    Ask Coding Partner
                                </button>
                                <div class="mt-4 p-4 bg-gray-700 rounded-lg border dashboard-border-dark">
                                    <h4 class="text-lg font-semibold dashboard-text-light mb-2">Coding Partner Response:</h4>
                                    <div id="codingResponse" class="dashboard-text-light whitespace-pre-wrap">
                                        Ask your coding question here.
                                    </div>
                                    <div id="codingError" class="text-red-400 mt-2 hidden"></div>
                                </div>
                            </div>

                            <!-- Career Guide Feature -->
                            <div>
                                <h3 class="text-xl font-semibold dashboard-text-light mb-3">Career Guide ✨</h3>
                                <p class="dashboard-muted-text mb-3">Receive advice on career paths, resume building, or interview preparation.</p>
                                <textarea id="careerPrompt" rows="4" class="w-full p-3 rounded-lg bg-gray-700 border dashboard-border-dark dashboard-text-light placeholder-dashboard-muted-text focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="e.g., 'What are key skills for a data scientist?', or 'Give me tips for a software engineering interview.'"></textarea>
                                <button id="sendCareerPrompt" class="px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition duration-200 mt-4 self-end">
                                    Get Career Advice
                                </button>
                                <div class="mt-4 p-4 bg-gray-700 rounded-lg border dashboard-border-dark">
                                    <h4 class="text-lg font-semibold dashboard-text-light mb-2">Career Guide Response:</h4>
                                    <div id="careerResponse" class="dashboard-text-light whitespace-pre-wrap">
                                        Ask your career question here.
                                    </div>
                                    <div id="careerError" class="text-red-400 mt-2 hidden"></div>
                                </div>
                            </div>
                        </section>

                        <section id="maps" class="hidden mb-8 dashboard-card">
                            <h2 class="text-3xl font-bold dashboard-primary-text mb-6">Interactive Maps</h2>
                            <p class="dashboard-muted-text mb-4">Explore different mapping integrations for your dashboard.</p>

                            <div class="space-y-8">
                                <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                    <h3 class="text-2xl font-semibold dashboard-secondary-text mb-3">Google Maps (Advanced Marker)</h3>
                                    <p class="dashboard-muted-text mb-3">An interactive map powered by Google Maps Platform, featuring advanced markers. Requires an API key.</p>
                                    <gmp-map center="40.12150192260742,-100.45039367675781" zoom="4" map-id="DEMO_MAP_ID">
                                        <gmp-advanced-marker position="40.12150192260742,-100.45039367675781" title="My location"></gmp-advanced-marker>
                                    </gmp-map>
                                    <div class="api-key-warning mt-4">
                                        <strong>IMPORTANT:</strong> The Google Maps API key is embedded in the script tag in \`showDashboardSection\` function. For production, **never expose your API key directly in client-side code.** Consider using a backend proxy.
                                        <br>
                                        If you are getting an \`InvalidKeyMapError\`, ensure \`AIzaSyBPG8dG29cl0TvYRGyLozejGed5Wj5Ab80\` is valid and has "Maps JavaScript API" enabled in your Google Cloud Console, along with correct application restrictions.
                                    </div>
                                </div>

                                <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                    <h3 class="text-2xl font-semibold dashboard-secondary-text mb-3">Leaflet.js with OpenStreetMap</h3>
                                    <p class="dashboard-muted-text mb-3">A free and open-source interactive map solution using OpenStreetMap data. No API key needed for basic use.</p>
                                    <div id="leaflet-map-container"></div>
                                </div>
                            </div>
                        </section>

                        <section id="meeting-minutes" class="hidden mb-8 dashboard-card">
                            <h2 class="text-3xl font-bold dashboard-primary-text mb-6">Meeting Minutes: Fruitful™ Dashboard Development</h2>
                            <p class="text-lg dashboard-muted-text mb-4">A quick recap of our discussions regarding API integrations and future features.</p>

                            <div class="space-y-8">
                                <div>
                                    <h3 class="text-2xl font-semibold dashboard-text-light mb-3">Meeting Details:</h3>
                                    <ul class="list-disc list-inside ml-4 dashboard-text-light space-y-1">
                                        <li><strong>Date:</strong> June 23, 2025</li>
                                        <li><strong>Time:</strong> 18:45 SAST (6:45 PM, Silver Lakes Golf Estate, Gauteng, South Africa)</li>
                                        <li><strong>Attendees:</strong> Fruitful™ Dashboard Development Team (represented by user and Gemini AI™)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 class="text-2xl font-semibold dashboard-text-light mb-3">1. Review of Previous API Discussions:</h3>
                                    <div class="space-y-4 ml-4">
                                        <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2">Design Styling API Key:</h4>
                                            <p class="dashboard-muted-text"><strong>Conclusion:</strong> No single "API key" for generic styling. Styling handled primarily by CSS (e.g., Tailwind CSS). Specific design services (e.g., Google Fonts, mapping APIs with custom styles) *would* require their own API keys.</p>
                                            <p class="dashboard-muted-text mt-1"><strong>Action:</strong> Continue using Tailwind CSS. Explore specific API-driven styling if a particular design service is integrated.</p>
                                        </div>
                                        <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2">Language Toggler:</h4>
                                            <p class="dashboard-muted-text"><strong>Conclusion:</strong> Achieved via JavaScript logic and \`data-key\` attributes for translatable text. No external API key strictly necessary for the toggler if translations are stored locally.</p>
                                            <p class="dashboard-muted-text mt-1"><strong>Action:</strong> Current implementation is good. For complex internationalization, consider dedicated I18n JavaScript libraries or a translation API if dynamic, on-the-fly translation is required.</p>
                                        </div>
                                        <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2">Selector to Change All Text in HTML with Script:</h4>
                                            <p class="dashboard-muted-text"><strong>Conclusion:</strong> \`document.querySelectorAll()\` with specific tag names or custom attributes is the best method for targeted text manipulation. Use \`document.querySelectorAll('*')\` with extreme caution.</p>
                                            <p class="dashboard-muted-text mt-1"><strong>Action:</strong> Continue using specific selectors for controlled text modification.</p>
                                        </div>
                                        <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2">General Helpful API Categories (Recap):</h4>
                                            <ul class="list-disc list-inside ml-4 dashboard-muted-text space-y-1">
                                                <li>**Mapping & Location:** Google Maps Platform (requires key).</li>
                                                <li>**Data & Information:** OpenWeatherMap (key), REST Countries (often no key), News API (key), Free Dictionary (no key).</li>
                                                <li>**Authentication & User Management:** Firebase Auth, Auth0.</li>
                                                <li>**Payment Processing:** Stripe (key), PayPal (credentials).</li>
                                                <li>**AI/ML:** OpenAI (key), Hugging Face Inference API (key), **Gemini AI™ API (key - our current focus!)**.</li>
                                                <li>**Image/Media:** Pexels API / Unsplash API (keys).</li>
                                                <li>**Utility:** Bitly API (key), SendGrid API / Mailgun API (keys).</li>
                                            </ul>
                                            <p class="api-key-warning mt-3">
                                                <strong>CRITICAL SECURITY NOTE:</strong> Never expose API keys directly in client-side code. Use a backend server or strict restrictions.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 class="text-2xl font-semibold dashboard-text-light mb-3">2. Gemini AI™ Integration (Current Progress & Understanding):</h3>
                                    <div class="space-y-4 ml-4">
                                        <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2">What does a Gemini AI™ API Key do? (for "Baby Staff"):</h4>
                                            <p class="dashboard-text-light mb-2">Imagine the Gemini AI™ as a super-smart robot brain that lives far away in a Google data center. This robot brain can do amazing things like talk like a human, understand pictures, summarize long texts, and write code.</p>
                                            <p class="dashboard-text-light mb-2">**Your Gemini AI™ API Key is like a special secret VIP pass** that allows your Fruitful™ Dashboard to "talk" to this super-smart robot brain. It tells Google it's *our* dashboard asking, keeps track of usage, and ensures safe communication.</p>
                                            <p class="dashboard-text-light">**Crucial Point for "Baby Staff":** This API key is a **secret!** Never show it to anyone who shouldn't have access, and never put it directly into code that everyone can see (like the HTML if it's on a public website). It's like your house key – keep it safe!</p>
                                        </div>
                                        <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2">Key Acquisition:</h4>
                                            <p class="dashboard-muted-text">API keys are obtained via <a href="https://aistudio.google.com/" target="_blank" class="dashboard-secondary-text hover:underline">Google AI Studio</a>.</p>
                                        </div>
                                        <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2">Current Dashboard Implementation:</h4>
                                            <p class="dashboard-muted-text">A new "AI Gemini™" section has been added with a general prompt area, plus new specialized "Coding Partner" and "Career Guide" features, all powered by Gemini AI™. The API key for Gemini is now explicitly set using the key you provided (\`AIzaSyBGSDZATtITv5iIoB3rgKHBpWx9MrufxXE\`).</p>
                                            <p class="api-key-warning mt-2">
                                                <strong>ACTION REQUIRED for PRODUCTION:</strong> While the key is now in the code, for any production deployment, move this API call to a secure backend server to protect your key.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 class="text-2xl font-semibold dashboard-text-light mb-3">3. Discussion of New API-related Features for Fruitful™ Dashboard:</h3>
                                    <div class="space-y-6 ml-4">
                                        <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2"><i class="fas fa-code"></i> Coding Partner Integration:</h4>
                                            <p class="dashboard-muted-text"><strong>Concept:</strong> Use Gemini AI™'s code generation and explanation capabilities.</p>
                                            <p class="dashboard-muted-text"><strong>API(s) to explore:</strong> Gemini AI™ API (already integrated).</p>
                                            <p class="dashboard-muted-text"><strong>Implementation Idea:</strong> Integrated into "AI Gemini™" section with dedicated input/output.</p>
                                        </div>
                                        <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2"><i class="fas fa-graduation-cap"></i> Career Guide Integration:</h4>
                                            <p class="dashboard-muted-text"><strong>Concept:</strong> Leverage AI™ to provide career advice, resume tips, interview prep, or learning paths.</p>
                                            <p class="dashboard-muted-text"><strong>API(s) to explore:</strong> Gemini AI™ API (primary), potentially specialized career APIs for structured data.</p>
                                            <p class="dashboard-muted-text"><strong>Implementation Idea:</strong> New "Career Insights" section where users input goals/questions for AI™-generated guidance.</p>
                                        </div>
                                        <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2"><i class="fas fa-mobile-alt"></i> "🦊 Foxed Has Mobiles™" - Product Data/Inventory Integration:</h4>
                                            <p class="dashboard-muted-text"><strong>Concept:</strong> Pull mobile product data (names, specs, prices, stock) from a dedicated system.</p>
                                            <p class="dashboard-muted-text"><strong>API(s) to explore:</strong> Likely a **custom API** from "Foxed Has Mobiles™" or a third-party e-commerce platform API (Shopify, WooCommerce).</p>
                                            <p class="dashboard-muted-text"><strong>Action:</strong> Contact "Foxed Has Mobiles™" for API documentation and keys.</p>
                                        </div>
                                        <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2"><i class="fas fa-shield-alt"></i> "🌳 Baobab Security Network™" - Security Monitoring:</h4>
                                            <p class="dashboard-muted-text"><strong>Concept:</strong> Display security alerts, network status, or security logs.</p>
                                            <p class="dashboard-muted-text"><strong>API(s) to explore:</strong> Likely a **custom API** from "Baobab Security Network™".</p>
                                            <p class="dashboard-muted-text"><strong>Action:</strong> Obtain API documentation and credentials from "Baobab Security Network™".</p>
                                        </div>
                                        <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2"><i class="fas fa-shopping-cart"></i> "🌱Global_Complete_purchase™" & "🌱Global_checkout_success™" - E-commerce Analytics:</h4>
                                            <p class="dashboard-muted-text"><strong>Concept:</strong> Track successful purchases and checkout completions.</p>
                                            <p class="dashboard-muted-text"><strong>API(s) to explore:</strong> Google Analytics Data API, Custom E-commerce Platform API, CRM/ERP APIs.</p>
                                            <p class="dashboard-muted-text"><strong>Implementation Idea:</strong> New charts/metrics in "Data Analytics" showing conversion rates, successful purchases, checkout funnel performance.</p>
                                        </div>
                                        <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2"><i class="fas fa-cogs"></i> Xero Accounting Integration:</h4>
                                            <p class="dashboard-muted-text"><strong>Concept:</strong> Integrate with Xero for accounting data (invoices, payments, etc.).</p>
                                            <p class="dashboard-muted-text"><strong>API(s) to explore:</strong> Xero API (OAuth 2.0).</p>
                                            <p class="api-key-warning mt-2">
                                                <strong>CRITICAL SECURITY NOTE:</strong> Xero Client ID, Client Secret, and Webhook Key **MUST** be handled on a secure backend server. They should never be directly exposed in client-side code. This setup will require a full OAuth 2.0 flow initiated from your server.
                                            </p>
                                            <p class="dashboard-muted-text mt-1"><strong>Action:</strong> Develop server-side logic for Xero OAuth and API calls. Client-side will only initiate the OAuth flow to the backend.</p>
                                        </div>
                                        <div class="dashboard-card p-4 rounded-lg border dashboard-border-dark">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2"><i class="fab fa-paypal"></i> PayPal Integration:</h4>
                                            <p class="dashboard-muted-text"><strong>Concept:</strong> Integrate various PayPal functionalities for payments (SDK, Hosted Buttons).</p>
                                            <p class="dashboard-muted-text"><strong>API(s) to explore:</strong> PayPal JavaScript SDK, PayPal Buttons API.</p>
                                            <p class="api-key-warning mt-2">
                                                <strong>SECURITY NOTE:</strong> While PayPal SDK \`client-id\` can be on the frontend, for critical operations and security best practices, server-side processing for payments is highly recommended. Hosted Button IDs are less sensitive but still should be managed carefully.
                                            </p>
                                            <p class="dashboard-muted-text mt-1"><strong>Action:</strong> Implement PayPal SDK and/or Hosted Buttons where relevant on payment-related pages, ensuring server-side validation for actual transactions.</p>
                                            <button onclick="mockPayPalSdkIntegration()" class="px-4 py-2 bg-blue-500 text-white rounded-md mt-2 text-sm hover:bg-blue-600">Test PayPal SDK (Mock)</button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 class="text-2xl font-semibold dashboard-text-light mb-3">4. Live Demos (for Visual Learners / "Baby Staff"):</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="dashboard-card p-4 rounded-lg shadow-md border dashboard-border-dark flex flex-col items-center">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2">Live Google Map</h4>
                                            <p class="dashboard-muted-text mb-3">A real-time map, demonstrating location services. (Replace with your actual embed!)</p>
                                            <div class="w-full h-64 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                                                <iframe src="YOUR_GOOGLE_MAP_EMBED_CODE" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                                                <span class="dashboard-muted-text absolute text-center">**PLACEHOLDER MAP**<br>Get your embed code from Google Maps.</span>
                                            </div>
                                        </div>
                                        <div class="dashboard-card p-4 rounded-lg shadow-md border dashboard-border-dark flex flex-col items-center">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2">Live YouTube Video</h4>
                                            <p class="dashboard-muted-text mb-3">An embedded video, showing media integration. (Replace with your actual embed!)</p>
                                            <div class="w-full h-64 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                                                <iframe width="100%" height="100%" src="YOUR_YOUTUBE_EMBED_CODE" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                                <span class="dashboard-muted-text absolute text-center">**PLACEHOLDER VIDEO**<br>Get your embed code from YouTube.</span>
                                            </div>
                                        </div>
                                        <div class="dashboard-card p-4 rounded-lg shadow-md border dashboard-border-dark flex flex-col items-center">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2">Live Spotify Music</h4>
                                            <p class="dashboard-muted-text mb-3">Interactive Spotify embeds for albums/tracks.</p>
                                            <div class="w-full h-64 bg-gray-800 rounded-lg overflow-hidden flex flex-col items-center justify-center space-y-2 p-2">
                                                <iframe style="border-radius:12px" src="https://open.spotify.com/embed/album/3RyjFxsU9hcmg14vqzUUMy?utm_source=generator" width="90%" height="100" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                                                <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/2kdQY3b6dDRGonyIzcWljc?utm_source=generator" width="90%" height="100" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                                                <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/6Xe9wT5xeZETPwtaP2ynUz?utm_source=generator" width="90%" height="100" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                                            </div>
                                        </div>
                                        <div class="dashboard-card p-4 rounded-lg shadow-md border dashboard-border-dark flex flex-col items-center">
                                            <h4 class="text-xl font-medium dashboard-secondary-text mb-2">Gemini AI™ Test (re-iterated)</h4>
                                            <p class="dashboard-muted-text mb-3">See our core AI™ integration in action.</p>
                                            <div class="w-full h-64 bg-gray-800 rounded-lg p-4 overflow-auto text-sm dashboard-text-light">
                                                <p>This is where our Gemini AI™ interacts. You can test it in the "AI Gemini™" section!</p>
                                                <p class="mt-2 dashboard-muted-text">Example: Ask the AI™ "What is the capital of France?"</p>
                                                <p class="mt-2 text-red-400">**Remember to add your actual API Key!**</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 class="text-2xl font-semibold dashboard-text-light mb-3">5. Action Items for the Team:</h3>
                                    <ul class="list-disc list-inside ml-4 dashboard-text-light space-y-2">
                                        <li>**IMMEDIATE & CRITICAL:** Replace \`YOUR_GEMINI_API_KEY\` in the JavaScript with your actual key from Google AI Studio.</li>
                                        <li>**SECURITY:** Begin planning for secure backend proxying of all API calls for production deployment.</li>
                                        <li>**API ACQUISITION:** Contact "Foxed Has Mobiles™" and "Baobab Security Network™" for their API documentation and access credentials.</li>
                                        <li>**ANALYTICS:** Investigate Google Analytics Data API or e-commerce platform APIs for detailed purchase/checkout event tracking.</li>
                                        <li>**UI/UX:** Brainstorm and design user interfaces for "Coding Partner" and "Career Guide" functionalities.</li>
                                        <li>**EMBED CODES:** Generate actual embed codes for the live demos (Google Maps, YouTube, Spotify) to make this section truly "live" for the team.</li>
                                        <li>**AUTHENTICATION:** Implement Firebase/Google authentication for "Sign In" and "Sign Up" sections to enable user accounts.</li>
                                        <li>**SETTINGS:** Develop functionality for the "Settings" panel (e.g., saving user preferences, updating profile).</li>
                                        <li>**CONTINUOUS LEARNING:** Encourage "baby staff" to review API documentation for any integrated service to understand capabilities and limitations.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <!-- Settings Section (New) -->
                        <section id="settings" class="hidden mb-8 dashboard-card">
                            <h2 class="text-3xl font-bold dashboard-primary-text mb-6">Settings</h2>
                            <p class="dashboard-muted-text mb-4">
                                Manage your account preferences, notifications, and application settings.
                            </p>

                            <div class="space-y-6">
                                <div class="dashboard-sub-card">
                                    <h3 class="text-xl font-semibold dashboard-text-light mb-3">Profile Settings</h3>
                                    <div class="flex flex-col gap-4">
                                        <div>
                                            <label for="userName" class="block text-sm font-medium dashboard-muted-text mb-1">Full Name</label>
                                            <input type="text" id="userName" value="[Your Name]" class="w-full px-3 py-2 rounded-lg bg-gray-700 border dashboard-border-dark dashboard-text-light focus:outline-none focus:ring-2 focus:ring-primary-color">
                                        </div>
                                        <div>
                                            <label for="userEmail" class="block text-sm font-medium dashboard-muted-text mb-1">Email Address</label>
                                            <input type="email" id="userEmail" value="[Your Email]" class="w-full px-3 py-2 rounded-lg bg-gray-700 border dashboard-border-dark dashboard-text-light focus:outline-none focus:ring-2 focus:ring-primary-color" disabled>
                                            <p class="text-xs text-gray-500 mt-1">Email cannot be changed here.</p>
                                        </div>
                                        <button onclick="saveProfileSettings()" class="px-6 py-3 bg-primary-color text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200 self-start">
                                            Save Profile
                                        </button>
                                        <div id="profileSaveMessage" class="mt-2 text-sm text-green-400 hidden"></div>
                                    </div>
                                </div>

                                <div class="dashboard-sub-card">
                                    <h3 class="text-xl font-semibold dashboard-text-light mb-3">Notification Preferences</h3>
                                    <div class="flex items-center justify-between mb-3">
                                        <span class="dashboard-muted-text">Email Notifications</span>
                                        <label class="toggle-switch">
                                            <input type="checkbox" id="emailNotifications" checked onchange="toggleNotification('Email')">
                                            <span class="slider"></span>
                                        </label>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="dashboard-muted-text">Push Notifications</span>
                                        <label class="toggle-switch">
                                            <input type="checkbox" id="pushNotifications" onchange="toggleNotification('Push')">
                                            <span class="slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div class="dashboard-sub-card">
                                    <h3 class="text-xl font-semibold dashboard-text-light mb-3">Theme Settings</h3>
                                    <div class="flex items-center justify-between">
                                        <span class="dashboard-muted-text">Dark Mode</span>
                                        <label class="toggle-switch">
                                            <input type="checkbox" id="darkModeToggle" checked onchange="toggleDarkMode(this)">
                                            <span class="slider"></span>
                                        </label>
                                    </div>
                                    <p class="text-xs text-gray-500 mt-2">
                                        Note: Theme changes currently apply globally based on primary sector configuration.
                                    </p>
                                </div>

                                <div class="dashboard-sub-card">
                                    <h3 class="text-xl font-semibold dashboard-text-light mb-3">API Key Management</h3>
                                    <p class="dashboard-muted-text mb-4">
                                        View and manage API keys for integrations. For security, sensitive keys are not editable here.
                                    </p>
                                    <div class="space-y-3 text-sm dashboard-text-light">
                                        <p><strong>Google Maps API Key:</strong> <code>[Configured in script, not displayed for security]</code></p>
                                        <p><strong>Gemini AI™ API Key:</strong> <code>[Configured in script, not displayed for security]</code></p>
                                        <p><strong>PayPal SDK Client ID:</strong> <code>${window.API_KEYS.PAYPAL_SDK_CLIENT_ID}</code> <span class="text-yellow-400 text-xs">(For client-side; server-side processing recommended)</span></p>
                                        <p><strong>Xero Client ID:</strong> <code>${window.API_KEYS.XERO_CLIENT_ID}</code> <span class="text-red-400 text-xs">(Backend Only!)</span></p>
                                        <p><strong>Xero Redirect URI:</strong> <code>${window.API_KEYS.XERO_REDIRECT_URI}</code> <span class="text-red-400 text-xs">(Backend Only!)</span></p>
                                        <p class="api-key-warning mt-3">
                                            <strong>SECURITY ALERT:</strong> The above values are shown for demonstration. In a real application, most API keys (especially secrets) should be managed **only on your backend server** and never exposed client-side.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <footer class="py-8 px-6 md:px-12 text-center">
        © 2025 FAA™ Treaty System™. All Rights Reserved. Powered by 🦍 glyphs + Vault API. Synced with Seedwave™.
    </footer>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>

    <script>
        // --- GLOBAL API KEYS AND CREDENTIALS (FOR DEMO/DEVELOPMENT) ---
        // IMPORTANT SECURITY NOTE:
        // For production environments, sensitive API keys (especially client secrets,
        // webhook keys, and any key giving write access or access to sensitive user data)
        // MUST NEVER be directly exposed in client-side JavaScript.
        // Instead, these should be securely stored on a backend server, and client-side
        // applications should communicate with your backend, which then proxies
        // requests to the third-party APIs.
        window.API_KEYS = {
            // PayPal
            PAYPAL_SDK_CLIENT_ID: "BAAGdPecRsf6dw_nIrWqUen0GdW0UsBZapp1Gn62xkPdD-Vqc-4lqWAidKK8LOObXux8pHJGjXknZoar6Q",
            PAYPAL_HOSTED_BUTTON_STARTER: "EMWGPGHNN8Y8E",
            PAYPAL_HOSTED_BUTTON_PRO: "QGU3ZUQCMD49Q",
            PAYPAL_HOSTED_BUTTON_ENTERPRISE: "9C88S44F93M5J",
            PAYPAL_HOSTED_BUTTON_BANIMAL_LOOP: "YOUR_BANIMAL_PAYPAL_BUTTON_ID_HERE", // Placeholder

            // Google Maps (already present, now explicitly listed)
            GOOGLE_MAPS_API_KEY: "AIzaSyBPG8dG29cl0TvYRGyLozejGed5Wj5Ab80",

            // Spotify (Access Token - Note: These are short-lived. A backend would refresh them.)
            SPOTIFY_ACCESS_TOKEN: "BQBDSZ232IQmSLV1BROkxqdwNMoGhtitKOJBjDzE-Lu9YKsSK1RKVwXNfYfncP2wf6Fj6xcYlnGD75baEqOmd3XtxhUhB-X6koPd92H9S0rQBqZ0HSKpsb04HiAme_FtqVLket7_s07gH9y1nxuPhbRyxp0r59oXtovV-uw0lCt2B7Mh5OmN3untEAGhfg6a6AZsaWLsv02dh6zKOQ_6DXHvCHZWxcVmoggu4eLA2NrqAf8rFRSNOw6HQpaN-VZkJWblznWQ0pT7ynzjpKOPlM_70N7vOLIZF8XnRmN1Oe784V-XfYNV-j1x1kdXGEpzlx1", // Long token, likely for API calls, not embeds.

            // Gemini AI (already present)
            GEMINI_API_KEY: "AIzaSyBGSDZATtITv5iIoB3rgKHBpWx9MrufxXE",

            // Xero (CRITICAL: These MUST be handled server-side for production!)
            XERO_CLIENT_ID: "81B3573D453040508996432C5DAD565B",
            XERO_CLIENT_SECRET: "FIaJGmsaCcKR3Z8kWxPnQd04EhYy6_bImPmoitQDP1U6Smaq", // Highly sensitive!
            XERO_REDIRECT_URI: "https://seedwave.faa.zone/admin_panel_xero.html",
            XERO_WEBHOOK_KEY: "2fd5LQV0TQDI3572Er/sg66zqEbl8mFWRyfX3XkoKFZGRLK2cZPGpWV/j4yMTU7aUpbgBCfeZkuHnQIwD/0igw==", // Highly sensitive!
        };


        // --- GLOBAL CONFIGURATION FOR ALL SECTORS ---
        window.allSectorConfigs = {
            "fruitful-global": {
                name: "Fruitful™ Global",
                shortName: "Fruitful™",
                description: "Innovate. Connect. Thrive. Discover a new era of collaboration and sustainable growth with Fruitful™'s cutting-edge platform.",
                heroHeadline: "Innovate. Connect. <span class='dynamic-accent-text'>Thrive.</span>",
                heroSubtitle: "Discover a new era of collaboration and sustainable growth with Fruitful™'s cutting-edge platform.",
                ctaButtonText: "Get Started Today <span>🚀</span>",
                colors: {
                    primary: "#6366f1", // Purple
                    secondary: "#a855f7", // Lighter Purple
                    accent: "#f97316", // Orange
                    button: "#c084fc",
                    buttonDark: "#8b5cf6",
                    bgStart: "#1f215a",
                    bgEnd: "#3b0764",
                    textColor: "#e2e8f0",
                    mutedText: "#a0aec0",
                    cardBg: "#1a1b20",
                    borderColor: "rgba(255,255,255,0.1)",
                },
                coreBrand: {
                    id: "fruitful-innovations",
                    name: "Fruitful Innovations™",
                    slogan: "The original spirit of progress.",
                    description: "This panel provides a detailed overview of the core brand for the currently selected sector. It includes its mission, key functionalities, and its overall contribution to the Fruitful™ ecosystem.",
                    subDescription: "Fruitful Innovations™ is the foundational pillar of the entire FAA.Zone™ ecosystem, driving forward the core principles of collaboration, sustainability, and AI™-powered growth. It encompasses the overarching vision and strategic initiatives that guide all other sectors and brands within Fruitful Global™.",
                    icon: "fas fa-leaf",
                    highlights: [
                        "Architecting the entire Treaty System™ infrastructure.",
                        "Developing core AI™ models for cross-sector insights.",
                        "Establishing global partnerships for sustainable growth.",
                        "Overseeing the ethical and technological roadmap of FAA.Zone™."
                    ],
                    link: "#",
                    shopLink: "#",
                    colors: {
                        primary: "#22c55e", // Green
                        accent: "#3b82f6", // Blue
                        text: "#333333",
                        mutedText: "#666666",
                        bgStart: "#F0F9FF", // Light Blue
                        bgEnd: "#E0F2FE", // Slightly darker Light Blue
                        button: "#22c55e", // Green
                        buttonDark: "#16a34a"
                    },
                    canvasColors: ['rgba(224, 242, 254, ', 'rgba(240, 249, 255, '], // for canvas particles
                },
                features: [
                    { icon: "💡", title: "AI™-Powered Insights", description: "Leverage advanced AI™ to gain deep insights, optimize operations, and make smarter decisions." },
                    { icon: "🤝", title: "Global Collaboration", description: "Connect with thousands of independent brands and partners worldwide, fostering a network of mutual growth." },
                    { icon: "🌱", title: "Sustainable Solutions", description: "Champion eco-friendly practices and contribute to a healthier planet through our curated marketplace." },
                    { icon: "🔒", title: "Secure VaultMesh™", description: "Protect your data and transactions with our state-of-the-art blockchain-inspired security protocols." },
                    { icon: "📈", title: "Real-time Analytics", description: "Monitor your progress and impact with intuitive dashboards and real-time performance metrics." },
                    { icon: "🌐", title: "OmniScroll™ Integration", description: "Seamlessly integrate with our OmniScroll™ ledger for transparent and efficient record-keeping." }
                ],
                terminals: [
                    { name: "VaultMaster™ Terminal", url: "vault-master.html", icon: "🦍" },
                    { name: "Cube Lattice GPT™", url: "cube-lattice.html", icon: "🧱" },
                    { name: "Global View GPT™", url: "global-view.html", icon: "🌍" },
                    { name: "Freight Ops GPT™", url: "freight-ops.html", icon: "🚚" },
                    { name: "Loop Watch GPT™", url: "loop-watch.html", icon: "♻️" },
                    { name: "Seedwave™ GPT", url: "seedwave.html", icon: "🌱" },
                    { name: "Distribution GPT™", url: "distribution.html", icon: "📦" },
                    { name: "Signal GPT™", url: "signal.html", icon: "🔐" },
                    { name: "7038 FAA™ Brands", url: "faa-brands.html", icon: "📦" }
                ],
                subNodes: [
                    { id: "omnisignal", name: "OmniSignal™", description: "Advanced multi-protocol messaging for decentralized apps.", icon: "fas fa-broadcast-tower", link: "#" },
                    { id: "pulsegrid", name: "PulseGrid™", description: "High-performance data orchestration grid.", icon: "fas fa-network-wired", link: "#" },
                    { id: "vaultdna", name: "VaultDNA™", description: "Immutable digital fingerprints for content.", icon: "fas fa-fingerprint", link: "#" },
                    { id: "claimroot", name: "ClaimRoot™", description: "Anchors digital claims and timestamps.", icon: "fas fa-clock", link: "#" },
                    { id: "scrollclaim", name: "ScrollClaim™ Contracts", description: "Programmable wrappers for digital rights.", icon: "fas fa-file-contract", link: "#" },
                    { id: "ghosttrace", name: "GhostTrace™ Gen2", description: "Next-gen traceability protocol.", icon: "fas fa-ghost", link: "#" },
                    { id: "baobab-terminal", name: "Baobab Terminal™", description: "CLI for Treaty Grid interaction.", icon: "fas fa-tree", link: "#" }
                ],
                dashboard: {
                    overviewDescription: "This sector represents the overarching Fruitful Global™ initiatives and serves as the central hub for all operations. It provides a holistic view of the ecosystem's performance and strategic direction.",
                }
            },
            "banimal-sector": {
                name: "Banimal™ Sector",
                shortName: "Banimal™",
                description: "Step into the heartwarming world of Banimal™, where every purchase creates a ripple of kindness. Discover thoughtful baby essentials and innovative lighting solutions.",
                heroHeadline: "Banimal™: <br> <span>🐑Kind Creatures. Global Impact.</span>",
                heroSubtitle: "Discover Banimal™'s world of thoughtful baby essentials & innovative lighting. For every purchase, we deliver the same item to a child in need, identified by the Baobab Security Network™'s data-driven insights.",
                ctaButtonText: "Explore Banimal™'s World <i class='fas fa-arrow-right'></i>",
                colors: {
                    primary: "#90EE90", // Soft Green
                    secondary: "#6B8E23", // Darker Green
                    accent: "#66B2FF", // Gentle Blue
                    button: "#90EE90",
                    buttonDark: "#6B8E23",
                    bgStart: "#FFF0ED", // Soft Peach
                    bgEnd: "#FFFAF5", // Cream
                    textColor: "#333333",
                    mutedText: "#666666",
                    cardBg: "#FDF5E6", // Light creamy background
                    borderColor: "rgba(0,0,0,0.05)",
                },
                coreBrand: {
                    id: "banimal",
                    name: "Banimal™",
                    slogan: "Kind Creatures. Global Impact.",
                    description: "Banimal™ is the core brand of the Banimal™ Sector, dedicated to creating thoughtful products that also contribute to social good. Its mission is to combine ethical commerce with impactful philanthropy.",
                    subDescription: "**For every Banimal™ item purchased, an identical item is donated to a child in need, powered by insights from the Baobab Security Network™.** Experience meaningful impact with every choice.",
                    icon: "fas fa-paw",
                    highlights: [
                        "Ethical Baby Essentials",
                        "Innovative Lighting Solutions",
                        "One-for-One Donation Model",
                        "Partnership with Baobab Security Network™ for Needs Identification"
                    ],
                    link: "global_brands.html",
                    shopLink: "https://www.banimal.co.za/",
                    colors: {
                        primary: "#90EE90", // Green
                        accent: "#66B2FF", // Blue
                        text: "#333333",
                        mutedText: "#666666",
                        bgStart: "#FFF0ED",
                        bgEnd: "#FFFAF5",
                        button: "#90EE90",
                        buttonDark: "#6B8E23"
                    },
                    canvasColors: ['rgba(255, 240, 237, ', 'rgba(248, 220, 220, '], // for canvas particles
                },
                features: [
                    { icon: "👶", title: "Thoughtful Baby Essentials", description: "Carefully designed products for infants, focusing on safety, comfort, and sustainable materials." },
                    { icon: "💡", title: "Innovative Lighting", description: "Creative and energy-efficient lighting solutions that enhance living spaces with unique designs." },
                    { icon: "💖", title: "Impactful Philanthropy", description: "Every purchase directly contributes to a child in need, fostering a direct and transparent cycle of giving." },
                    { icon: "🌳", title: "Baobab Network™ Insights", description: "Donations are guided by data from the Baobab Security Network™, ensuring aid reaches those most in need." },
                    { icon: "♻️", title: "Sustainable Sourcing", description: "Commitment to environmentally friendly materials and production processes to minimize ecological footprint." },
                    { icon: "🌐", title: "Global Reach", description: "Brings positive impact to communities worldwide through a network of trusted partners and distribution channels." }
                ],
                terminals: [], // Banimal might not have terminals, or specific ones.
                subNodes: [
                    { id: "baobab-security-network", name: "Baobab Security Network™", description: "Identifies and verifies humanitarian needs globally.", icon: "fas fa-shield-alt", link: "#" },
                    { id: "little-lights", name: "Little Lights™", description: "Sub-brand for innovative children's lighting.", icon: "fas fa-lightbulb", link: "#" },
                    { id: "cozy-creatures", name: "Cozy Creatures™", description: "Sub-brand for soft baby textiles and plush toys.", icon: "fas fa-teddy-bear", link: "#" }
                ],
                dashboard: {
                    overviewDescription: "The Banimal™ Sector Dashboard provides an overview of ethical commerce, philanthropic impact, and product performance within the Banimal™ ecosystem. Track donations, product reach, and community engagement.",
                }
            },
            // Add more sectors here following the same structure
            "ai-logic-grid": {
                name: "AI™, Logic & Grid Systems",
                shortName: "AI™, Logic",
                description: "Powering intelligence, data orchestration, and decentralized networks.",
                heroHeadline: "AI™, Logic & Grid Systems: <br> <span>Powering the Future of Data.</span>",
                heroSubtitle: "At the forefront of innovation, developing intelligent automation and data management protocols for the Fruitful Global™ Treaty Grid.",
                ctaButtonText: "Explore AI™ Solutions <span>✨</span>",
                colors: {
                    primary: "#0071e3", // Apple Blue
                    secondary: "#30d158", // Apple Green
                    accent: "#B8860B", // Corporate gold accent
                    button: "#30d158",
                    buttonDark: "#28a745",
                    bgStart: "#1b0033", // Purple from original AI page
                    bgEnd: "#1a1a1c", // Deep black/dark grey
                    textColor: "#f5f5f7",
                    mutedText: "#b0b0b0",
                    cardBg: "#2a2a2e",
                    borderColor: "#3a3a3e",
                },
                coreBrand: {
                    id: "codenest-ai",
                    name: "CodeNest™ AI™",
                    slogan: "Intelligent Scroll Development",
                    description: "Revolutionize your web scroll projects with AI™-powered code generation, optimization, and seamless deployment. Your direct portal to the scroll economy.",
                    subDescription: "CodeNest™ AI™ leverages advanced machine learning to automate development workflows, enhance code quality, and accelerate time-to-market for digital scrolls across the Fruitful Global™ Treaty Grid.",
                    icon: "fas fa-brain",
                    highlights: [
                        "AI™-Powered Code Generation & Optimization",
                        "Seamless Deployment to Treaty Grid",
                        "Enhanced Scroll Economy Integration",
                        "Automated Workflow Solutions"
                    ],
                    link: "/brands/codenest_desktop_dashboard.html",
                    shopLink: "#",
                    colors: {
                        primary: "#0071e3", // Apple Blue
                        accent: "#B8860B", // Corporate gold accent
                        text: "#1d1d1f",
                        mutedText: "#666666",
                        bgStart: "#F5F5F7",
                        bgEnd: "#EBEBEB",
                        button: "#0071e3",
                        buttonDark: "#005bb5"
                    },
                    canvasColors: ['rgba(245, 245, 247, ', 'rgba(235, 235, 235, '], // for canvas particles
                },
                features: [
                    { icon: "🤖", title: "Intelligent Automation", description: "Automate complex tasks and decision-making processes across the grid with adaptive AI™ algorithms." },
                    { icon: "🗄️", title: "Data Orchestration", description: "Efficiently manage and secure vast datasets with our robust data grids and synchronization protocols." },
                    { icon: "🔗", title: "Decentralized Networks", description: "Operate on a secure, distributed ledger, ensuring transparency and resilience for all operations." },
                    { icon: "🔮", title: "Predictive Analytics", description: "Utilize AI™ to forecast trends, anticipate challenges, and identify new opportunities for growth." },
                    { icon: "📜", title: "Automated Reporting", description: "Streamline compliance and regulatory reporting with AI™-driven data aggregation and generation." },
                    { icon: "⚡", title: "Scalable Infrastructure", description: "Build and deploy solutions that scale effortlessly to meet global demands and expanding data needs." }
                ],
                terminals: [], // AI Logic has its own dashboard terminals from the previous file.
                subNodes: [
                    { id: "omnisignal-ai", name: "OmniSignal™ AI™", description: "AI™-enhanced multi-protocol messaging and signaling.", icon: "fas fa-robot", link: "#" },
                    { id: "pulsegrid-ai", name: "PulseGrid™ AI™", description: "AI™-optimized data orchestration grid for performance.", icon: "fas fa-microchip", link: "#" },
                    { id: "vaultdna-ai", name: "VaultDNA™ AI™", description: "AI™-driven immutable digital fingerprints for enhanced security.", icon: "fas fa-fingerprint", link: "#" }
                ],
                dashboard: {
                    overviewDescription: "The AI™, Logic & Grid Systems dashboard provides deep insights into the performance of our intelligent automation and data management protocols. Monitor AI™ model efficiency, data grid utilization, and network health.",
                }
            },
            // Default sector if none is specified or found
            "default": {
                name: "Fruitful™ Global",
                shortName: "Fruitful™",
                description: "Innovate. Connect. Thrive. Discover a new era of collaboration and sustainable growth with Fruitful™'s cutting-edge platform.",
                heroHeadline: "Innovate. Connect. <span class='dynamic-accent-text'>Thrive.</span>",
                heroSubtitle: "Discover a new era of collaboration and sustainable growth with Fruitful™'s cutting-edge platform.",
                ctaButtonText: "Get Started Today <span>🚀</span>",
                colors: {
                    primary: "#6366f1", // Purple
                    secondary: "#a855f7", // Lighter Purple
                    accent: "#f97316", // Orange
                    button: "#c084fc",
                    buttonDark: "#8b5cf6",
                    bgStart: "#1f215a",
                    bgEnd: "#3b0764",
                    textColor: "#e2e8f0",
                    mutedText: "#a0aec0",
                    cardBg: "#1a1b20",
                    borderColor: "rgba(255,255,255,0.1)",
                },
                coreBrand: {
                    id: "fruitful-innovations",
                    name: "Fruitful Innovations™",
                    slogan: "The original spirit of progress.",
                    description: "This panel provides a detailed overview of the core brand for the currently selected sector. It includes its mission, key functionalities, and its overall contribution to the Fruitful™ ecosystem.",
                    subDescription: "Fruitful Innovations™ is the foundational pillar of the entire FAA.Zone™ ecosystem, driving forward the core principles of collaboration, sustainability, and AI™-powered growth. It encompasses the overarching vision and strategic initiatives that guide all other sectors and brands within Fruitful Global™.",
                    icon: "fas fa-leaf",
                    highlights: [
                        "Architecting the entire Treaty System™ infrastructure.",
                        "Developing core AI™ models for cross-sector insights.",
                        "Establishing global partnerships for sustainable growth.",
                        "Overseeing the ethical and technological roadmap of FAA.Zone™."
                    ],
                    link: "#",
                    shopLink: "#",
                    colors: {
                        primary: "#22c55e", // Green
                        accent: "#3b82f6", // Blue
                        text: "#333333",
                        mutedText: "#666666",
                        bgStart: "#F0F9FF", // Light Blue
                        bgEnd: "#E0F2FE", // Slightly darker Light Blue
                        button: "#22c55e", // Green
                        buttonDark: "#16a34a"
                    },
                    canvasColors: ['rgba(224, 242, 254, ', 'rgba(240, 249, 255, '], // for canvas particles
                },
                features: [
                    { icon: "💡", title: "AI™-Powered Insights", description: "Leverage advanced AI™ to gain deep insights, optimize operations, and make smarter decisions." },
                    { icon: "🤝", title: "Global Collaboration", description: "Connect with thousands of independent brands and partners worldwide, fostering a network of mutual growth." },
                    { icon: "🌱", title: "Sustainable Solutions", description: "Champion eco-friendly practices and contribute to a healthier planet through our curated marketplace." },
                    { icon: "🔒", title: "Secure VaultMesh™", description: "Protect your data and transactions with our state-of-the-art blockchain-inspired security protocols." },
                    { icon: "📈", title: "Real-time Analytics", description: "Monitor your progress and impact with intuitive dashboards and real-time performance metrics." },
                    { icon: "🌐", title: "OmniScroll™ Integration", description: "Seamlessly integrate with our OmniScroll™ ledger for transparent and efficient record-keeping." }
                ],
                terminals: [
                    { name: "VaultMaster™ Terminal", url: "vault-master.html", icon: "🦍" },
                    { name: "Cube Lattice GPT™", url: "cube-lattice.html", icon: "🧱" },
                    { name: "Global View GPT™", url: "global-view.html", icon: "🌍" },
                    { name: "Freight Ops GPT™", url: "freight-ops.html", icon: "🚚" },
                    { name: "Loop Watch GPT™", url: "loop-watch.html", icon: "♻️" },
                    { name: "Seedwave™ GPT", url: "seedwave.html", icon: "🌱" },
                    { name: "Distribution GPT™", url: "distribution.html", icon: "📦" },
                    { name: "Signal GPT™", url: "signal.html", icon: "🔐" },
                    { name: "7038 FAA™ Brands", url: "faa-brands.html", icon: "📦" }
                ],
                subNodes: [
                    { id: "omnisignal", name: "OmniSignal™", description: "Advanced multi-protocol messaging for decentralized apps.", icon: "fas fa-broadcast-tower", link: "#" },
                    { id: "pulsegrid", name: "PulseGrid™", description: "High-performance data orchestration grid.", icon: "fas fa-network-wired", link: "#" },
                    { id: "vaultdna", name: "VaultDNA™", description: "Immutable digital fingerprints for content.", icon: "fas fa-fingerprint", link: "#" },
                    { id: "claimroot", name: "ClaimRoot™", description: "Anchors digital claims and timestamps.", icon: "fas fa-clock", link: "#" },
                    { id: "scrollclaim", name: "ScrollClaim™ Contracts", description: "Programmable wrappers for digital rights.", icon: "fas fa-file-contract", link: "#" },
                    { id: "ghosttrace", name: "GhostTrace™ Gen2", description: "Next-gen traceability protocol.", icon: "fas fa-ghost", link: "#" },
                    { id: "baobab-terminal", name: "Baobab Terminal™", description: "CLI for Treaty Grid interaction.", icon: "fas fa-tree", link: "#" }
                ],
                dashboard: {
                    overviewDescription: "This sector represents the overarching Fruitful Global™ initiatives and serves as the central hub for all operations. It provides a holistic view of the ecosystem's performance and strategic direction.",
                }
            }
        };

        // --- GLOBAL STATE ---
        let currentSectorId = "fruitful-global"; // Default sector ID
        let currentSectorConfig = {}; // Will hold the configuration of the active sector

        let googleMapScriptLoaded = false;
        let leafletMapInstance = null;
        let activeDashboardSubSection = 'overview';
        let activeMusicSubSection = 'allMusic';
        let coreBrandAnimationFrameId; // Changed from banimalAnimationFrameId

        // Gemini API Key and Google Maps API Key (from previous versions, kept for consistency)
        const GEMINI_API_KEY = window.API_KEYS.GEMINI_API_KEY;
        const GOOGLE_MAPS_API_KEY = window.API_KEYS.GOOGLE_MAPS_API_KEY;


        // --- DYNAMIC RENDERING FUNCTIONS ---

        // Function to update CSS variables based on the current sector's colors
        function updateCssVariables(colors) {
            const root = document.documentElement;
            root.style.setProperty('--sector-primary-color', colors.primary);
            root.style.setProperty('--sector-secondary-color', colors.secondary);
            root.style.setProperty('--sector-accent-color', colors.accent);
            root.style.setProperty('--sector-button-color', colors.button);
            root.style.setProperty('--sector-button-color-dark', colors.buttonDark);
            root.style.setProperty('--sector-background-gradient-start', colors.bgStart);
            root.style.setProperty('--sector-background-gradient-end', colors.bgEnd);
            root.style.setProperty('--sector-text-color', colors.textColor);
            root.style.setProperty('--sector-muted-text', colors.mutedText);
            root.style.setProperty('--sector-card-bg', colors.cardBg);
            root.style.setProperty('--sector-border-color', colors.borderColor);

            // Core brand specific variables
            root.style.setProperty('--core-brand-bg-start', colors.coreBrand?.bgStart || colors.bgStart);
            root.style.setProperty('--core-brand-bg-end', colors.coreBrand?.bgEnd || colors.bgEnd);
            root.style.setProperty('--core-brand-text-color', colors.coreBrand?.text || colors.textColor);
            root.style.setProperty('--core-brand-dark-text', colors.coreBrand?.text || colors.textColor);
            root.style.setProperty('--core-brand-muted-text', colors.coreBrand?.mutedText || colors.mutedText);
            root.style.setProperty('--core-brand-accent-color', colors.coreBrand?.accent || colors.accent);
            root.style.setProperty('--core-brand-button-color', colors.coreBrand?.button || colors.button);
            root.style.setProperty('--core-brand-button-color-dark', colors.coreBrand?.buttonDark || colors.buttonDark);

            // Featured core brand specific variables (usually same as core brand if featured)
            root.style.setProperty('--featured-core-brand-bg-start', colors.coreBrand?.bgStart || colors.bgStart);
            root.style.setProperty('--featured-core-brand-bg-end', colors.coreBrand?.bgEnd || colors.bgEnd);
            root.style.setProperty('--featured-core-brand-text-color', colors.coreBrand?.text || colors.textColor);
            root.style.setProperty('--featured-core-brand-muted-text', colors.coreBrand?.mutedText || colors.mutedText);
            root.style.setProperty('--featured-core-brand-button-color', colors.coreBrand?.button || colors.button);
            root.style.setProperty('--featured-core-brand-button-color-dark', colors.coreBrand?.buttonDark || colors.buttonDark);
        }

        // Renders all dynamic content for the current sector
        function renderCurrentSectorContent() {
            currentSectorConfig = window.allSectorConfigs[currentSectorId] || window.allSectorConfigs["default"];
            const currentCoreBrand = currentSectorConfig.coreBrand;

            // Update page title
            document.getElementById('dynamicTitle').innerText = \`${currentSectorConfig.name} | Fruitful Global™\`;

            // Update CSS variables
            updateCssVariables(currentSectorConfig.colors);

            // Update Header
            document.getElementById('headerFruitfulText').innerText = currentSectorConfig.shortName;
            const headerCoreBrandLink = document.getElementById('headerCoreBrandLink');
            if (headerCoreBrandLink) {
                headerCoreBrandLink.innerText = currentCoreBrand.name;
                headerCoreBrandLink.onclick = () => showMainSection('core-brand-landing-page');
            }


            // Update Hero Section
            document.getElementById('heroHeadline').innerHTML = currentSectorConfig.heroHeadline;
            document.getElementById('heroSubtitle').innerText = currentSectorConfig.heroSubtitle;
            document.getElementById('heroCtaButton').innerHTML = currentSectorConfig.ctaButtonText;


            // Update Features Grid
            const featuresGrid = document.getElementById('featuresGrid');
            featuresGrid.innerHTML = ''; // Clear existing features
            currentSectorConfig.features.forEach(feature => {
                const featureCard = document.createElement('div');
                featureCard.className = 'feature-card';
                featureCard.innerHTML = \`
                    <div>${feature.icon}</div>
                    <h4>${feature.title}</h4>
                    <p>${feature.description}</p>
                \`;
                featuresGrid.appendChild(featureCard);
            });

            // Update Featured Core Brand Section
            const featuredCoreBrandSection = document.getElementById('featured-core-brand-section');
            if (currentCoreBrand) {
                featuredCoreBrandSection.classList.remove('hidden'); // Ensure it's visible if a core brand exists
                document.getElementById('featuredCoreBrandTitle').innerHTML = \`✨ Featured Core Brand: ${currentCoreBrand.name} ✨\`;
                document.getElementById('featuredCoreBrandDescription').innerText = currentCoreBrand.description;
                document.getElementById('featuredCoreBrandSubDescription').innerText = currentCoreBrand.subDescription;
                const featuredCtaButton = document.getElementById('featuredCoreBrandCtaButton');
                if (featuredCtaButton) {
                    featuredCtaButton.innerHTML = \`Discover ${currentCoreBrand.name} <i class="${currentCoreBrand.icon} ml-2"></i>\`;
                }
            } else {
                featuredCoreBrandSection.classList.add('hidden'); // Hide if no core brand
            }

            // Update Vault Terminal Buttons
            const terminalButtonsContainer = document.getElementById('terminalButtons');
            terminalButtonsContainer.innerHTML = ''; // Clear existing buttons
            if (currentSectorConfig.terminals && currentSectorConfig.terminals.length > 0) {
                currentSectorConfig.terminals.forEach(terminal => {
                    const button = document.createElement('button');
                    button.className = 'terminal-btn p-6';
                    button.innerHTML = \`${terminal.icon} ${terminal.name}\`;
                    button.onclick = () => loadTerminal(terminal.url);
                    terminalButtonsContainer.appendChild(button);
                });
            } else {
                terminalButtonsContainer.innerHTML = '<p class="text-gray-400">No specific terminals configured for this sector.</p>';
            }


            // Update Sector Glyphs Grid
            const sectorGlyphGrid = document.getElementById('sectorGlyphGrid');
            sectorGlyphGrid.innerHTML = ''; // Clear existing glyphs
            for (const sectorId in window.allSectorConfigs) {
                if (sectorId === "default") continue; // Skip default
                const sector = window.allSectorConfigs[sectorId];
                const glyph = document.createElement('a');
                glyph.href = \`javascript:void(0)\`; // Use javascript:void(0) to prevent default hash jump
                glyph.className = 'glyph';
                glyph.innerHTML = \`<i class="${sector.coreBrand.icon}"></i> ${sector.name}\`; // Using icon here
                glyph.onclick = (event) => {
                    event.preventDefault(); // Prevent default anchor jump (redundant with javascript:void(0) but good practice)
                    switchSector(sectorId);
                    // showMainSection('hero-section'); // Go to top of new sector
                };
                sectorGlyphGrid.appendChild(glyph);
            }

            // Update Sector Dropdown in Header
            const sectorDropdown = document.getElementById('sectorDropdown');
            sectorDropdown.innerHTML = ''; // Clear existing dropdown items
            for (const sectorId in window.allSectorConfigs) {
                if (sectorId === "default") continue;
                const sector = window.allSectorConfigs[sectorId];
                const dropdownItem = document.createElement('a');
                dropdownItem.href = \`javascript:void(0)\`; // Use javascript:void(0) to prevent default hash jump
                dropdownItem.className = 'block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700';
                dropdownItem.innerHTML = \`<i class="${sector.coreBrand.icon} mr-2"></i> ${sector.name}\`;
                dropdownItem.onclick = (event) => {
                    event.preventDefault();
                    switchSector(sectorId);
                    // Close dropdown (optional, handled by CSS group-hover for now)
                };
                sectorDropdown.appendChild(dropdownItem);
            }

            // Update Core Brand Landing Page (the dynamic Banimal™ page)
            const coreBrandLandingPage = document.getElementById('core-brand-landing-page');
            const coreBrandCanvas = document.getElementById('core-brand-canvas');
            if (currentCoreBrand) {
                document.getElementById('coreBrandHeadline').innerHTML = \`${currentCoreBrand.name}: <br> <span id="coreBrandSlogan">${currentCoreBrand.slogan}</span>\`;
                document.getElementById('coreBrandDescriptionHero').innerText = currentCoreBrand.subDescription;

                const coreBrandExploreButton = document.getElementById('coreBrandExploreButton');
                if (coreBrandExploreButton) {
                    coreBrandExploreButton.href = currentCoreBrand.link;
                    coreBrandExploreButton.innerHTML = \`Explore ${currentCoreBrand.name}'s World <i class="${currentCoreBrand.icon} ml-2"></i>\`;
                }

                const coreBrandShopButton = document.getElementById('coreBrandShopButton');
                if (coreBrandShopButton) {
                    coreBrandShopButton.href = currentCoreBrand.shopLink;
                    coreBrandShopButton.innerHTML = \`Shop Now <i class="fas fa-external-link-alt ml-2"></i>\`;
                }

                // Initialize/reset canvas particles for the core brand landing page
                if (coreBrandCanvas && coreBrandCanvas.getContext) {
                    initCoreBrandParticles(currentCoreBrand.canvasColors);
                } else {
                    console.warn("Core Brand Canvas or context not available.");
                }

            } else {
                 // Hide core brand specific sections if no core brand is defined for the sector
                 coreBrandLandingPage.classList.add('hidden');
                 // Also ensure the header link for core brand is hidden or appropriately handled
                 document.getElementById('headerCoreBrandLink').classList.add('hidden');
            }


            // Update Dashboard Overview (Section Home)
            document.getElementById('dashboardOverviewTitle').innerText = \`${currentSectorConfig.name} Overview\`;
            document.getElementById('dashboardOverviewDescription').innerText = currentSectorConfig.dashboard.overviewDescription;

            // Update Core Brand Dashboard Panel
            const coreBrandDashboardPanel = document.getElementById('core-brand-dashboard-panel');
            if (currentCoreBrand) {
                document.getElementById('coreBrandDashboardTitle').innerText = \`Core Brand: ${currentCoreBrand.name}\`;
                document.getElementById('coreBrandDashboardIcon').className = \`${currentCoreBrand.icon} text-6xl\`;
                document.getElementById('coreBrandDashboardName').innerText = currentCoreBrand.name;
                document.getElementById('coreBrandDashboardSlogan').innerText = currentCoreBrand.slogan;
                document.getElementById('coreBrandDashboardDescription').innerText = currentCoreBrand.description;

                const highlightsList = document.getElementById('coreBrandDashboardHighlights');
                if (highlightsList) {
                    highlightsList.innerHTML = '';
                    currentCoreBrand.highlights.forEach(highlight => {
                        const li = document.createElement('li');
                        li.innerText = highlight;
                        highlightsList.appendChild(li);
                    });
                }
                const coreBrandDashboardCta = document.getElementById('coreBrandDashboardCta');
                if (coreBrandDashboardCta) {
                    coreBrandDashboardCta.href = currentCoreBrand.link;
                }
            } else {
                 coreBrandDashboardPanel.classList.add('hidden');
            }

            // Update Sub-Node Index Dashboard Panel
            const subNodeIndexPanel = document.getElementById('sub-node-index');
            document.getElementById('subNodeIndexTitle').innerText = \`Sub-Node Index: ${currentSectorConfig.name}\`;
            document.getElementById('subNodeIndexDescription').innerText = \`Explore the various sub-nodes and specialized entities that operate within the ${currentSectorConfig.name} sector, providing granular functionalities and services.\`;

            const subNodeGrid = document.getElementById('subNodeGrid');
            subNodeGrid.innerHTML = ''; // Clear existing sub-node cards
            if (currentSectorConfig.subNodes && currentSectorConfig.subNodes.length > 0) {
                currentSectorConfig.subNodes.forEach(node => {
                    const subNodeCard = document.createElement('div');
                    subNodeCard.className = 'dashboard-sub-card p-6 rounded-lg shadow-md border dashboard-border-dark';
                    subNodeCard.innerHTML = \`
                        <div class="flex items-center mb-3">
                            <i class="${node.icon} text-3xl text-blue-400 mr-4"></i>
                            <h3 class="text-xl font-semibold dashboard-text-light">${node.name}</h3>
                        </div>
                        <p class="dashboard-muted-text">${node.description}</p>
                        <a href="javascript:void(0)" onclick="showSubNodeDetails('${node.id}')" class="text-primary-color hover:underline text-sm mt-3 inline-block">Learn More <i class="fas fa-arrow-right text-xs ml-1"></i></a>
                    \`; // Changed here: onclick handler
                    subNodeGrid.appendChild(subNodeCard);
                });
            } else {
                subNodeGrid.innerHTML = '<p class="dashboard-muted-text">No specific sub-nodes defined for this sector yet.</p>';
            }

            // Ensure the main section is always visible after rendering content
            // No automatic scroll to top here. It will be handled conditionally below.
            // showMainSection(document.querySelector('.header-nav-active')?.getAttribute('href')?.substring(1) || 'hero-section');
        }

        // Function to switch active sector
        function switchSector(sectorId) {
            // Stop any current core brand canvas animation before switching
            if (coreBrandAnimationFrameId) {
                cancelAnimationFrame(coreBrandAnimationFrameId);
                coreBrandAnimationFrameId = null;
            }

            currentSectorId = sectorId;
            renderCurrentSectorContent();
            // Force a re-initialization of the chart for the new sector data if applicable
            initializeBrandChart();
            console.log(\`Switched to sector: ${currentSectorId}\`);
        }

        // --- Landing Page Specific Functions ---

        // Function to toggle main landing page sections and the dashboard
        function showMainSection(sectionIdToShow) {
            // Stop any active core brand canvas animations if not going to that section
            if (coreBrandAnimationFrameId && sectionIdToShow !== 'core-brand-landing-page') {
                cancelAnimationFrame(coreBrandAnimationFrameId);
                coreBrandAnimationFrameId = null;
            }

            // Hide all landing page sections
            document.querySelectorAll('section').forEach(section => { // Select all sections
                section.classList.add('hidden');
            });
            // Hide the dashboard wrapper
            document.getElementById('fruitful-dashboard-wrapper').classList.add('hidden');
            document.getElementById('fruitful-dashboard-wrapper').classList.remove('flex'); // Ensure flex is removed when hidden

            // Show the selected section
            const sectionToShow = document.getElementById(sectionIdToShow);
            if (sectionToShow) {
                sectionToShow.classList.remove('hidden');
            }

            // Update active state for main header navigation links
            document.querySelectorAll('.header-nav-item').forEach(link => {
                link.classList.remove('header-nav-active');
            });
            // Find the link that points to the current sectionIdToShow
            const clickedLink = document.querySelector(\`.header-nav-item[onclick*="showMainSection('${sectionIdToShow}')"]\`);
            if (clickedLink) {
                clickedLink.classList.add('header-nav-active');
            }

            // Special handling for dashboard display
            if (sectionIdToShow === 'fruitful-dashboard-wrapper') {
                sectionToShow.classList.add('flex'); // Ensure dashboard wrapper uses flex for layout
                showDashboardSection(activeDashboardSubSection); // Show the default dashboard sub-section
                // DO NOT SCROLL TO TOP FOR DASHBOARD ACTIVATION
            } else {
                // Ensure main dashboard sections are hidden when not viewing dashboard
                document.querySelectorAll('#fruitful-dashboard-wrapper main section').forEach(section => {
                    section.classList.add('hidden');
                });
                // Hide music sub-sidebar if moving away from dashboard
                document.getElementById('musicSubSidebar').classList.add('hidden');
                // ONLY SCROLL TO TOP FOR MAIN LANDING SECTIONS
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // Special handling for Core Brand landing page to start canvas animation
            if (sectionIdToShow === 'core-brand-landing-page') {
                const colors = currentSectorConfig.coreBrand?.canvasColors || currentSectorConfig.colors.canvasColors;
                if (colors) {
                    initCoreBrandParticles(colors); // Re-initialize particles to avoid artifacts
                    animateCoreBrandCanvas();
                }
            }
        }

        // Function to load terminal content into the iframe (from landing page)
        function loadTerminal(url) {
            document.getElementById('vault-frame').src = url;
            // Remove ring from all buttons and add to the clicked one
            document.querySelectorAll('.terminal-btn').forEach(btn => btn.classList.remove('ring', 'ring-blue-500'));
            // Use event.currentTarget to ensure the clicked button is targeted
            if (event && event.currentTarget) {
                event.currentTarget.classList.add('ring', 'ring-blue-500');
            }
            console.log("🧬 Terminal loaded:", url);
        }

        // Script for Share Signal (mock price update from landing page)
        function updateSharePrice() {
            const mockPrice = (80 + Math.random() * 10).toFixed(2);
            document.getElementById('price').innerText = \`$${mockPrice}\`;
            document.getElementById('timestamp').innerText = new Date().toLocaleTimeString();
        }

        // Chart.js for Seedwave Growth (from landing page)
        let brandGrowthChart = null; // Store chart instance to destroy/recreate
        function initializeBrandChart() {
            const ctx = document.getElementById('brandChart')?.getContext('2d');
            if (ctx) {
                // Destroy existing chart if it exists
                if (brandGrowthChart) {
                    brandGrowthChart.destroy();
                }

                brandGrowthChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                        datasets: [{
                            label: 'Treaty Brands Activated',
                            data: [3, 7, 13, 21], // Mock data, could be dynamic per sector
                            borderWidth: 2,
                            borderColor: currentSectorConfig.colors.primary, // Dynamic color
                            tension: 0.4,
                            fill: true,
                            backgroundColor: \`rgba(${parseInt(currentSectorConfig.colors.primary.slice(1,3), 16)}, ${parseInt(currentSectorConfig.colors.primary.slice(3,5), 16)}, ${parseInt(currentSectorConfig.colors.primary.slice(5,7), 16)}, 0.15)\`,
                            pointRadius: 4,
                            pointBackgroundColor: currentSectorConfig.colors.primary, // Dynamic color
                            pointBorderColor: '#1a1b20',
                            pointHoverRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)',
                                    drawBorder: false
                                },
                                ticks: {
                                    color: currentSectorConfig.colors.mutedText
                                }
                            },
                            x: {
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)',
                                    drawBorder: false
                                },
                                ticks: {
                                    color: currentSectorConfig.colors.mutedText
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false,
                                labels: {
                                    color: currentSectorConfig.colors.textColor
                                }
                            }
                        }
                    }
                });
            }
        }

        // UNIVERSAL PANEL TOGGLER SCRIPT for Sector Scrolls (will be updated by renderCurrentSectorContent)
        function showSectorPanel(panelId) {
            // Hide all sector and embedded panels
            document.querySelectorAll('[id^="embedded-"]').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.glyph').forEach(link => link.classList.remove('active')); // Remove active class from all links

            const el = document.getElementById(panelId);
            if (el) {
                el.classList.remove('hidden');
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Add active class to the clicked link
                const clickedLink = document.querySelector(\`.glyph[onclick*="${panelId}"]\`);
                if (clickedLink) {
                    clickedLink.classList.add('active');
                }
                // If it's the media sector, load its scroll profiles (mock data)
                if (panelId === 'embedded-media-snapshot') {
                    // This is where you'd fetch and display media-specific content
                    const mediaContentDiv = document.querySelector('#embedded-media-snapshot .scroll-cards');
                    if (mediaContentDiv) {
                        mediaContentDiv.innerHTML = \`<p class="dashboard-muted-text">Media content for Motion, Media, Sonic sector will load here.</p>
                            <iframe style="border-radius:12px; margin-top:1rem;" src="https://open.spotify.com/embed/album/3RyjFxsU9hcmg14vqzUUMy?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                            <iframe style="border-radius:12px; margin-top:1rem;" src="https://open.spotify.com/embed/track/2kdQY3b6dDRGonyIzcWljc?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                            <iframe style="border-radius:12px; margin-top:1rem;" src="https://open.spotify.com/embed/track/6Xe9wT5xeZETPwtaP2ynUz?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                        \`;
                    }
                }
            } else {
                console.warn('[FAA] Panel not found:', panelId);
            }
        }


        // --- Dashboard Specific Functions ---

        // This function initializes the Leaflet map (from dashboard)
        function initLeafletMap() {
            const mapContainer = document.getElementById("leaflet-map-container");
            if (!mapContainer || leafletMapInstance) return; // Prevent re-initialization

            // Initialize the map and set its view to chosen geographical coordinates and a zoom level (London)
            leafletMapInstance = L.map(mapContainer).setView([51.505, -0.09], 13);

            // Add an OpenStreetMap tile layer to the map
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(leafletMapInstance);

            // Add a marker to the map
            const marker = L.marker([51.5, -0.09]).addTo(leafletMapInstance);

            // Add a popup to the marker
            marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
        }

        function showDashboardSection(sectionId) {
            activeDashboardSubSection = sectionId; // Update the active sub-section for dashboard

            // Hide all dashboard sections
            document.querySelectorAll('#fruitful-dashboard-wrapper main section').forEach(section => {
                section.classList.add('hidden');
            });

            // Show the selected dashboard section
            const activeSection = document.getElementById(sectionId);
            if (activeSection) {
                activeSection.classList.remove('hidden');
            }

            // Update active state for dashboard sidebar links
            document.querySelectorAll('.dashboard-sidebar-nav-item').forEach(link => {
                link.classList.remove('dashboard-active-nav-item');
            });
            const clickedLink = document.querySelector(\`.dashboard-sidebar-nav-item[onclick*="${sectionId}"]\`);
            if (clickedLink) {
                clickedLink.classList.add('dashboard-active-nav-item');
            }

            // Handle visibility of music sub-sidebar
            const musicSubSidebar = document.getElementById('musicSubSidebar');
            if (sectionId === 'music') {
                musicSubSidebar.classList.remove('hidden');
                musicSubSidebar.classList.add('flex'); // Use flex to make it visible and take space
                showMusicSubSection(activeMusicSubSection); // Show the default music sub-section
            } else {
                musicSubSidebar.classList.add('hidden');
                musicSubSidebar.classList.remove('flex');
            }

            // Special handling for maps section to load Google Maps script and initialize Leaflet
            if (sectionId === 'maps') {
                // Load Google Maps script only once if not already loaded
                if (!googleMapScriptLoaded && document.getElementById('google-maps-api-script') === null) {
                    const script = document.createElement('script');
                    script.id = 'google-maps-api-script'; // Give it a unique ID
                    script.async = true;
                    script.defer = true;
                    script.src = \`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=console.debug&libraries=maps,marker&v=beta\`;
                    document.body.appendChild(script);
                    googleMapScriptLoaded = true; // Mark as loaded or loading
                }
                // Initialize Leaflet map when the section is shown
                initLeafletMap();
            }
            // IMPORTANT: No scroll to top here, as this function is for *internal* dashboard navigation.
        }

        function showMusicSubSection(subSectionId) {
            activeMusicSubSection = subSectionId; // Update the active sub-section

            // Hide all music sub-sections
            document.querySelectorAll('#music > div').forEach(subSection => {
                subSection.classList.add('hidden');
            });

            // Show the selected music sub-section
            const activeSubSectionContent = document.getElementById(subSectionId + 'Content');
            if (activeSubSectionContent) {
                activeSubSectionContent.classList.remove('hidden');
            }

            // Update active state for music sub-sidebar links
            document.querySelectorAll('#musicSubSidebar .dashboard-sidebar-nav-item').forEach(link => {
                link.classList.remove('dashboard-active-nav-item');
            });
            const clickedSubLink = document.querySelector(\`#musicSubSidebar .dashboard-sidebar-nav-item[onclick*="${subSectionId}"]\`);
            if (clickedSubLink) {
                clickedSubLink.classList.add('dashboard-active-nav-item');
            }
        }

        // Helper function for making API calls to Gemini™
        async function callGeminiAPI(prompt, responseDiv, errorDiv) {
            responseDiv.textContent = 'Generating response...';
            errorDiv.classList.add('hidden'); // Hide previous errors

            if (!prompt) {
                responseDiv.textContent = 'Please enter a prompt.';
                return;
            }

            if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
                responseDiv.textContent = '';
                errorDiv.textContent = 'Error: Gemini AI™ API Key is missing or invalid. Please ensure it\'s set correctly.';
                errorDiv.classList.remove('hidden');
                return;
            }

            try {
                const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }]
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(\`API Error: ${response.status} ${response.statusText} - ${errorData.error.message || 'Unknown error'}\`);
                }

                const data = await response.json();
                const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI™.';
                responseDiv.textContent = aiResponse;

            } catch (error) {
                console.error("Error calling Gemini AI™ API:", error);
                responseDiv.textContent = ''; // Clear "Generating response..."
                errorDiv.textContent = \`Failed to get AI™ response: ${error.message}. Check your Gemini AI™ API key and network.\`;
                errorDiv.classList.remove('hidden');
            }
        }

        // Event listener for General Query (Dashboard)
        document.addEventListener('click', async (event) => {
            if (event.target && event.target.id === 'sendGeminiPrompt') {
                const promptText = document.getElementById('geminiPrompt').value.trim();
                const responseDiv = document.getElementById('geminiResponse');
                const errorDiv = document.getElementById('geminiError');
                callGeminiAPI(promptText, responseDiv, errorDiv);
            }
        });

        // Event listener for Coding Partner (Dashboard)
        document.addEventListener('click', async (event) => {
            if (event.target && event.target.id === 'sendCodingPrompt') {
                const codingPromptText = document.getElementById('codingPrompt').value.trim();
                const responseDiv = document.getElementById('codingResponse');
                const errorDiv = document.getElementById('codingError');
                const fullPrompt = \`Act as a coding assistant. ${codingPromptText}\`;
                callGeminiAPI(fullPrompt, responseDiv, errorDiv);
            }
        });

        // Event listener for Career Guide (Dashboard)
        document.addEventListener('click', async (event) => {
            if (event.target && event.target.id === 'sendCareerPrompt') {
                const careerPromptText = document.getElementById('careerPrompt').value.trim();
                const responseDiv = document.getElementById('careerResponse');
                const errorDiv = document.getElementById('careerError');
                const fullPrompt = \`Act as a career guide. ${careerPromptText}\`;
                callGeminiAPI(fullPrompt, responseDiv, errorDiv);
            }
        });

        // Event listener for Admin Assistant (Dashboard)
        document.addEventListener('click', async (event) => {
            if (event.target && event.target.id === 'sendAdminAIPrompt') {
                const adminPromptText = document.getElementById('adminAIPrompt').value.trim();
                const responseDiv = document.getElementById('adminAIResponse');
                const errorDiv = document.getElementById('adminAIError');
                const fullPrompt = \`Act as an admin assistant for a dashboard. ${adminPromptText}\`;
                callGeminiAPI(fullPrompt, responseDiv, errorDiv);
            }
        });

        // --- Core Brand Canvas Animation Functions (Refactored from Banimal™) ---
        let coreBrandCanvas = null;
        let coreBrandCtx = null;
        let coreBrandParticles = [];
        const numCoreBrandParticles = 150;
        let currentCanvasColors = ['rgba(255, 255, 255, ', 'rgba(240, 240, 240, ']; // Default for canvas particles


        class CoreBrandParticle {
            constructor() {
                this.x = Math.random() * coreBrandCanvas.width;
                this.y = Math.random() * coreBrandCanvas.height;
                this.radius = Math.random() * 1.5 + 0.5;
                this.alpha = 0;
                this.speed = Math.random() * 0.3 + 0.05;
                this.directionX = Math.random() * 2 - 1;
                this.directionY = Math.random() * 2 - 1;
                const randomColorIndex = Math.floor(Math.random() * currentCanvasColors.length);
                this.baseColor = currentCanvasColors[randomColorIndex];
            }

            update() {
                this.x += this.directionX * this.speed;
                this.y += this.directionY * this.speed;

                if (this.alpha < 0.7 && this.speed > 0) {
                    this.alpha += 0.003;
                } else if (this.alpha > 0) {
                    this.alpha -= 0.001;
                } else {
                    this.x = Math.random() * coreBrandCanvas.width;
                    this.y = Math.random() * coreBrandCanvas.height;
                    this.alpha = 0;
                    this.speed = Math.random() * 0.3 + 0.05;
                    this.directionX = Math.random() * 2 - 1;
                    this.directionY = Math.random() * 2 - 1;
                }

                if (this.x < -this.radius || this.x > coreBrandCanvas.width + this.radius || this.y < -this.radius || this.y > coreBrandCanvas.height + this.radius) {
                    this.x = Math.random() * coreBrandCanvas.width;
                    this.y = Math.random() * coreBrandCanvas.height;
                    this.alpha = 0;
                }
            }

            draw() {
                coreBrandCtx.beginPath();
                coreBrandCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                coreBrandCtx.fillStyle = this.baseColor + this.alpha + ')';
                coreBrandCtx.shadowBlur = 5;
                coreBrandCtx.shadowColor = this.baseColor + (this.alpha * 0.8) + ')';
                coreBrandCtx.fill();
                coreBrandCtx.shadowBlur = 0;
            }
        }

        function resizeCoreBrandCanvas() {
            if (coreBrandCanvas) {
                coreBrandCanvas.width = window.innerWidth;
                coreBrandCanvas.height = window.innerHeight;
            }
        }

        function initCoreBrandParticles(colors) {
            coreBrandCanvas = document.getElementById('core-brand-canvas');
            if (!coreBrandCanvas) return;

            coreBrandCtx = coreBrandCanvas.getContext('2d');
            resizeCoreBrandCanvas();
            window.removeEventListener('resize', resizeCoreBrandCanvas); // Prevent duplicate listeners
            window.addEventListener('resize', resizeCoreBrandCanvas);

            currentCanvasColors = colors; // Update colors for particles
            coreBrandParticles = []; // Clear existing particles
            for (let i = 0; i < numCoreBrandParticles; i++) {
                coreBrandParticles.push(new CoreBrandParticle());
            }
        }

        function animateCoreBrandCanvas() {
            if (!coreBrandCtx) return;

            // Use the core brand's background color for clearing, but very transparently
            const bgStartRgb = hexToRgb(currentSectorConfig.coreBrand?.colors?.bgStart || "#FFFFFF");
            coreBrandCtx.fillStyle = \`rgba(${bgStartRgb.r}, ${bgStartRgb.g}, ${bgStartRgb.b}, 0.02)\`;
            coreBrandCtx.fillRect(0, 0, coreBrandCanvas.width, coreBrandCanvas.height);

            for (let i = 0; i < coreBrandParticles.length; i++) {
                coreBrandParticles[i].update();
                coreBrandParticles[i].draw();
            }
            coreBrandAnimationFrameId = requestAnimationFrame(animateCoreBrandCanvas);
        }

        function hexToRgb(hex) {
            const bigint = parseInt(hex.slice(1), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return { r, g, b };
        }

        // --- AUTHENTICATION PLACEHOLDER FUNCTIONS (For Firebase integration later) ---
        function handleSignIn() {
            const email = document.getElementById('signInEmail').value;
            const password = document.getElementById('signInPassword').value;
            const messageDiv = document.getElementById('signInMessage');

            // Basic validation
            if (!email || !password) {
                messageDiv.textContent = 'Please enter both email and password.';
                return;
            }

            messageDiv.textContent = 'Attempting to sign in... (Firebase integration pending)';
            console.log('Sign In Attempt:', { email, password });

            // In a real app, you'd use Firebase Auth signInWithEmailAndPassword here
            setTimeout(() => { // Simulate API call
                if (email === 'test@example.com' && password === 'password123') {
                    messageDiv.textContent = 'Sign In successful! (This is a mock login)';
                    messageDiv.style.color = '#22c55e'; // Green color
                    // Redirect or update UI
                    showMainSection('fruitful-dashboard-wrapper'); // Redirect to dashboard on mock success
                } else {
                    messageDiv.textContent = 'Mock Sign In Failed: Invalid credentials.';
                    messageDiv.style.color = '#ef4444'; // Red color
                }
            }, 1500);
        }

        function handleSignUp() {
            const name = document.getElementById('signUpName').value;
            const email = document.getElementById('signUpEmail').value;
            const password = document.getElementById('signUpPassword').value;
            const confirmPassword = document.getElementById('signUpConfirmPassword').value;
            const messageDiv = document.getElementById('signUpMessage');

            // Basic validation
            if (!name || !email || !password || !confirmPassword) {
                messageDiv.textContent = 'Please fill in all fields.';
                return;
            }
            if (password !== confirmPassword) {
                messageDiv.textContent = 'Passwords do not match.';
                return;
            }
            if (password.length < 6) { // Firebase minimum password length
                messageDiv.textContent = 'Password must be at least 6 characters long.';
                return;
            }

            messageDiv.textContent = 'Attempting to sign up... (Firebase integration pending)';
            console.log('Sign Up Attempt:', { name, email, password });

            // In a real app, you'd use Firebase Auth createUserWithEmailAndPassword here
            setTimeout(() => { // Simulate API call
                messageDiv.textContent = 'Sign Up successful! Please sign in. (This is a mock registration)';
                messageDiv.style.color = '#22c55e'; // Green color
                // Optionally clear form or redirect to sign-in
                document.getElementById('signUpForm').reset();
                showMainSection('sign-in-section'); // Redirect to sign-in after mock registration
            }, 1500);
        }

        // --- Settings Panel Functions ---
        function saveProfileSettings() {
            const userName = document.getElementById('userName').value;
            // In a real app, you'd save this to a backend/database
            console.log("Saving user profile:", { userName });

            const messageDiv = document.getElementById('profileSaveMessage');
            messageDiv.textContent = 'Profile settings saved! (Mock Save)';
            messageDiv.classList.remove('hidden');
            setTimeout(() => {
                messageDiv.classList.add('hidden');
            }, 3000);
        }

        function toggleNotification(type) {
            const checkbox = document.getElementById(\`${type.toLowerCase()}Notifications\`);
            console.log(\`${type} Notifications Toggled: ${checkbox.checked}\`);
            // In a real app, you'd send this preference to a backend
        }

        function toggleDarkMode(checkbox) {
            if (checkbox.checked) {
                document.documentElement.classList.add('dark');
                document.body.style.setProperty('background-color', '#0d1117');
                document.body.style.setProperty('color', '#e2e8f0');
                console.log("Dark Mode Enabled (mock)");
            } else {
                document.documentElement.classList.remove('dark');
                document.body.style.setProperty('background-color', '#f0f0f0'); // Example light mode bg
                document.body.style.setProperty('color', '#333333');
                console.log("Dark Mode Disabled (mock)");
            }
            // In a real app, you'd save this preference to local storage or a backend
        }

        function mockPayPalSdkIntegration() {
            const paypalClientId = window.API_KEYS.PAYPAL_SDK_CLIENT_ID;
            console.log(\`Mock PayPal SDK Integration triggered with Client ID: ${paypalClientId}\`);
            // In a real scenario, you'd load the PayPal JS SDK script here dynamically
            // and then render a PayPal button or perform a mock payment intent.
            showCustomModal("PayPal SDK Integration (Mock)", \`Attempting to initialize PayPal SDK with ID: <br><code>${paypalClientId}</code>.<br>This is a mock call.\`);
        }

        // --- Sub-Node Details Display Function (NEW) ---
        function showSubNodeDetails(nodeId) {
            const subNodeDetailsContainer = document.getElementById('subNodeDetailsContainer');
            const subNodeDetailTitle = document.getElementById('subNodeDetailTitle');
            const subNodeDetailDescription = document.getElementById('subNodeDetailDescription');
            const subNodeDetailContent = document.getElementById('subNodeDetailContent');

            // Hide the main grid of sub-nodes
            document.getElementById('subNodeGrid').classList.add('hidden');

            // Find the sub-node config
            const currentSubNodes = currentSectorConfig.subNodes;
            const selectedNode = currentSubNodes.find(node => node.id === nodeId);

            if (selectedNode) {
                subNodeDetailTitle.innerText = selectedNode.name;
                subNodeDetailDescription.innerText = selectedNode.description;
                subNodeDetailsContainer.classList.remove('hidden');

                // Populate content based on node ID (this is where you'll add more AI Logic specific content)
                let contentHtml = '';
                switch (nodeId) {
                    case 'omnisignal':
                        contentHtml = \`
                            <p class="dashboard-text-light mb-3"><strong>Details:</strong> OmniSignal™ ensures secure, real-time communication across all decentralized applications within the FAA.Zone™. It leverages advanced encryption and distributed ledger technology to prevent tampering and ensure data integrity.</p>
                            <h4 class="text-xl font-semibold dashboard-text-light mb-2">Key Features:</h4>
                            <ul class="list-disc list-inside ml-4 dashboard-muted-text space-y-1">
                                <li>End-to-end encrypted messaging</li>
                                <li>Broadcast and point-to-point signaling</li>
                                <li>Real-time data synchronization</li>
                                <li>Fault-tolerant architecture</li>
                            </ul>
                            <p class="dashboard-muted-text mt-4">For more advanced configurations, please refer to the OmniSignal™ API documentation.</p>
                        \`;
                        break;
                    case 'pulsegrid':
                        contentHtml = \`
                            <p class="dashboard-text-light mb-3"><strong>Details:</strong> PulseGrid™ is the high-performance backbone for data orchestration, optimizing data flow and processing across the Fruitful™ ecosystem. It ensures seamless interaction between various sector applications.</p>
                            <h4 class="text-xl font-semibold dashboard-text-light mb-2">Capabilities:</h4>
                            <ul class="list-disc list-inside ml-4 dashboard-muted-text space-y-1">
                                <li>High-throughput data ingestion</li>
                                <li>Intelligent data routing</li>
                                <li>Real-time data transformation</li>
                                <li>Scalable for massive data volumes</li>
                            </ul>
                            <p class="dashboard-muted-text mt-4">PulseGrid™ integrates directly with VaultMesh™ for secure data handling.</p>
                        \`;
                        break;
                    case 'vaultdna':
                        contentHtml = \`
                            <p class="dashboard-text-light mb-3"><strong>Details:</strong> VaultDNA™ provides immutable digital fingerprints for every piece of content and asset within the Treaty Grid. This ensures unalterable proof of origin, ownership, and integrity.</p>
                            <h4 class="text-xl font-semibold dashboard-text-light mb-2">Benefits:</h4>
                            <ul class="list-disc list-inside ml-4 dashboard-muted-text space-y-1">
                                <li>Unforgeable content identification</li>
                                <li>Transparent provenance tracking</li>
                                <li>Automated integrity verification</li>
                                <li>Reduced risk of intellectual property theft</li>
                            </ul>
                            <p class="dashboard-muted-text mt-4">Every ScrollClaim™ is secured by VaultDNA™.</p>
                        \`;
                        break;
                    case 'claimroot':
                        contentHtml = \`
                            <p class="dashboard-text-light mb-3"><strong>Details:</strong> ClaimRoot™ establishes the irrefutable origin and timestamp for all digital claims and transactions on the FAA.Zone™. It acts as the foundational anchor for verifying the authenticity and history of any asset or interaction.</p>
                            <h4 class="text-xl font-semibold dashboard-text-light mb-2">Functionality:</h4>
                            <ul class="list-disc list-inside ml-4 dashboard-muted-text space-y-1">
                                <li>Cryptographic timestamping</li>
                                <li>Distributed ledger recording</li>
                                <li>Immutable origin verification</li>
                                <li>Foundation for royalty enforcement</li>
                            </ul>
                            <p class="dashboard-muted-text mt-4">Crucial for TreatyCommerce™ and ScrollClaim™ integrity.</p>
                        \`;
                        break;
                    case 'scrollclaim':
                        contentHtml = \`
                            <p class="dashboard-text-light mb-3"><strong>Details:</strong> ScrollClaim™ Contracts are programmable smart contracts that encapsulate digital rights, access permissions, and royalty logic for content distributed across the FAA.Zone™. They automate agreements and enforce terms.</p>
                            <h4 class="text-xl font-semibold dashboard-text-light mb-2">Use Cases:</h4>
                            <ul class="list-disc list-inside ml-4 dashboard-muted-text space-y-1">
                                <li>Automated royalty distribution (10-11% for Diamond Tier)</li>
                                <li>Tiered content access management</li>
                                <li>Transferable digital licenses</li>
                                <li>Secure content monetization</li>
                            </ul>
                            <p class="dashboard-muted-text mt-4">Empowers creators and ensures fair compensation.</p>
                        \`;
                        break;
                    case 'ghosttrace':
                        contentHtml = \`
                            <p class="dashboard-text-light mb-3"><strong>Details:</strong> GhostTrace™ Gen2 provides advanced, privacy-preserving traceability for all interactions and data flows within the Fruitful Global™ ecosystem. It enables forensic analysis without compromising user privacy.</p>
                            <h4 class="text-xl font-semibold dashboard-text-light mb-2">Capabilities:</h4>
                            <ul class="list-disc list-inside ml-4 dashboard-muted-text space-y-1">
                                <li>Auditable interaction logs</li>
                                <li>Anomaly detection for security</li>
                                <li>Privacy-centric data masking</li>
                                <li>Real-time threat intelligence</li>
                            </ul>
                            <p class="dashboard-muted-text mt-4">Essential for maintaining trust and security across the network.</p>
                        \`;
                        break;
                    case 'baobab-terminal':
                        contentHtml = \`
                            <p class="dashboard-text-light mb-3"><strong>Details:</strong> The Baobab Terminal™ provides a command-line interface (CLI) for direct interaction with the underlying Treaty Grid. It's designed for advanced users and developers to manage contracts, deploy scrolls, and monitor network health.</p>
                            <h4 class="text-xl font-semibold dashboard-text-light mb-2">Commands & Usage:</h4>
                            <pre class="bg-gray-800 text-green-400 p-4 rounded-md overflow-auto text-sm mt-2">
<code>> baobab status
  Node Health: Optimal
  Connected Peers: 128
  Active Scrolls: 7038

> baobab deploy --path /my/new/scroll.zip --tier diamond
  Deployment initiated. TxHash: 0x...
  ScrollClaim™ issued.

> baobab query-royalty --txid 0x...
  Royalty payout: 10.5% to Wallet: 0x...
                            </code></pre>
                            <p class="dashboard-muted-text mt-4">Access requires proper authentication and permissions.</p>
                        \`;
                        break;
                    case 'baobab-security-network':
                        contentHtml = \`
                            <p class="dashboard-text-light mb-3"><strong>Details:</strong> The Baobab Security Network™ is a specialized sub-node focused on identifying and verifying humanitarian needs globally. It provides critical data insights that power ethical initiatives, such as Banimal™'s one-for-one donation model.</p>
                            <h4 class="text-xl font-semibold dashboard-text-light mb-2">Functions:</h4>
                            <ul class="list-disc list-inside ml-4 dashboard-muted-text space-y-1">
                                <li>Real-time need assessment in crisis zones</li>
                                <li>Data-driven impact verification</li>
                                <li>Secure beneficiary identification</li>
                                <li>Ethical data collection and privacy protocols</li>
                            </ul>
                            <p class="dashboard-muted-text mt-4">Collaborates with NGOs and local communities to ensure effective aid distribution.</p>
                        \`;
                        break;
                    case 'little-lights':
                        contentHtml = \`
                            <p class="dashboard-text-light mb-3"><strong>Details:</strong> Little Lights™ is a sub-brand under the Banimal™ Sector, specializing in innovative and child-safe lighting solutions. Their products are designed to be both whimsical and energy-efficient, providing comfort and learning opportunities for children.</p>
                            <h4 class="text-xl font-semibold dashboard-text-light mb-2">Product Philosophy:</h4>
                            <ul class="list-disc list-inside ml-4 dashboard-muted-text space-y-1">
                                <li>Sustainable materials and production</li>
                                <li>Non-toxic and child-friendly designs</li>
                                <li>Educational and interactive lighting features</li>
                                <li>Contribution to Banimal™'s one-for-one donation model</li>
                            </ul>
                            <p class="dashboard-muted-text mt-4">Shining a light on a brighter future for children globally.</p>
                        \`;
                        break;
                    case 'cozy-creatures':
                        contentHtml = \`
                            <p class="dashboard-text-light mb-3"><strong>Details:</strong> Cozy Creatures™ is another sub-brand within the Banimal™ Sector, offering a range of soft baby textiles and plush toys. Each product is crafted with hypoallergenic materials and designed for maximum comfort and safety for infants.</p>
                            <h4 class="text-xl font-semibold dashboard-text-light mb-2">Offerings:</h4>
                            <ul class="list-disc list-inside ml-4 dashboard-muted-text space-y-1">
                                <li>Organic cotton blankets and swaddles</li>
                                <li>Hand-knitted animal plush toys</li>
                                <li>Durable and washable baby apparel</li>
                                <li>Ethically sourced and fair-trade production</li>
                            </ul>
                            <p class="dashboard-muted-text mt-4">Providing comfort and warmth, one creature at a time, with a positive global impact.</p>
                        \`;
                        break;
                    case 'codenest-ai':
                        contentHtml = \`
                            <p class="dashboard-text-light mb-3"><strong>Details:</strong> CodeNest™ AI™ is the leading AI™-driven development platform for digital scrolls within the Fruitful Global™ Treaty Grid. It automates code generation, optimizes performance, and streamlines deployment, allowing developers to focus on innovation.</p>
                            <h4 class="text-xl font-semibold dashboard-text-light mb-2">Core Features:</h4>
                            <ul class="list-disc list-inside ml-4 dashboard-muted-text space-y-1">
                                <li>AI™-powered code completion and suggestion</li>
                                <li>Automated testing and debugging</li>
                                <li>Cross-platform compatibility generation</li>
                                <li>Direct integration with VaultMesh™ for secure deployment</li>
                            </ul>
                            <p class="dashboard-muted-text mt-4">Accelerating the creation of high-quality, secure digital experiences.</p>
                        \`;
                        break;
                    case 'omnisignal-ai':
                        contentHtml = \`
                            <p class="dashboard-text-light mb-3"><strong>Details:</strong> OmniSignal™ AI™ is an intelligent extension of OmniSignal™, incorporating advanced AI™ capabilities to further optimize secure, real-time communication. It learns from network patterns to enhance efficiency and detect anomalies.</p>
                            <h4 class="text-xl font-semibold dashboard-text-light mb-2">AI™ Enhancements:</h4>
                            <ul class="list-disc list-inside ml-4 dashboard-muted-text space-y-1">
                                <li>Predictive routing for faster message delivery</li>
                                <li>AI™-driven threat detection in communication streams</li>
                                <li>Adaptive encryption protocols</li>
                                <li>Automated network optimization and load balancing</li>
                            </ul>
                            <p class="dashboard-muted-text mt-4">Making communication smarter and more resilient.</p>
                        \`;
                        break;
                    case 'pulsegrid-ai':
                        contentHtml = \`
                            <p class="dashboard-text-light mb-3"><strong>Details:</strong> PulseGrid™ AI™ is the AI™-optimized version of the PulseGrid™ data orchestration system. It uses machine learning to dynamically adapt to data loads, predict bottlenecks, and intelligently manage data distribution for peak performance across the Fruitful Global™ network.</p>
                            <h4 class="text-xl font-semibold dashboard-text-light mb-2">Optimizations:</h4>
                            <ul class="list-disc list-inside ml-4 dashboard-muted-text space-y-1">
                                <li>Self-optimizing data pipelines</li>
                                <li>Predictive resource allocation</li>
                                <li>Real-time anomaly detection in data streams</li>
                                <li>Automated scaling based on demand</li>
                            </ul>
                            <p class="dashboard-muted-text mt-4">Ensuring uninterrupted and highly efficient data flow.</p>
                        \`;
                        break;
                    case 'vaultdna-ai':
                        contentHtml = \`
                            <p class="dashboard-text-light mb-3"><strong>Details:</strong> VaultDNA™ AI™ enhances the immutable digital fingerprinting with artificial intelligence, providing even more robust security and intelligent content verification. It can detect subtle patterns of unauthorized modifications or deepfakes.</p>
                            <h4 class="text-xl font-semibold dashboard-text-light mb-2">Enhanced Security:</h4>
                            <ul class="list-disc list-inside ml-4 dashboard-muted-text space-y-1">
                                <li>AI™-driven content authenticity verification</li>
                                <li>Predictive threat analysis for digital assets</li>
                                <li>Automated content lineage auditing</li>
                                <li>Machine learning for tamper detection</li>
                            </ul>
                            <p class="dashboard-muted-text mt-4">The ultimate guardian for digital intellectual property.</p>
                        \`;
                        break;
                    default:
                        contentHtml = \`<p class="dashboard-muted-text">Details for "${selectedNode.name}" are not yet available. Please check back later or contribute to its development!</p>\`;
                }
                subNodeDetailContent.innerHTML = contentHtml;
            } else {
                subNodeDetailsContainer.classList.add('hidden');
                console.warn('Sub-node details not found for ID:', nodeId);
            }
        }

        function hideSubNodeDetails() {
            document.getElementById('subNodeDetailsContainer').classList.add('hidden');
            document.getElementById('subNodeGrid').classList.remove('hidden');
        }


        // --- INITIALIZATION ---
        document.addEventListener('DOMContentLoaded', () => {
            // Set initial sector and render content
            switchSector("fruitful-global"); // Loads the default sector on page load

            // Initialize landing page features that don't depend on sector config
            updateSharePrice();
            setInterval(updateSharePrice, 9000); // Update share price every 9 seconds

            // Ensure a section is shown on initial load
            showMainSection('hero-section');

            // Initialize dark mode toggle (mock) - Ensure it reflects initial CSS state
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                // Read the initial state from CSS (assuming dark mode is default)
                darkModeToggle.checked = document.documentElement.classList.contains('dark') ||
                                         window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
        });
    </script>
</body>
</html>`;

const vaultMeshCheckoutTemplate = enhancedVaultMeshCheckoutTemplate;
const sectorIndexTemplate = advancedSectorIndexTemplate;

const initialBrands = [
  {
    name: "Seedwave™",
    slug: "seedwave",
    icon: "🌱",
    primaryColor: "#22c55e",
    description: "Analytics and global hub functionality with real-time insights",
    status: "active" as const,
  },
  {
    name: "VaultMesh™",
    slug: "vaultmesh",
    icon: "🔒",
    primaryColor: "#3b82f6",
    description: "Checkout systems and payment processing infrastructure",
    status: "active" as const,
  },
  {
    name: "Banimal™",
    slug: "banimal",
    icon: "🎯",
    primaryColor: "#f59e0b",
    description: "Interactive features and engagement tools for user experiences",
    status: "active" as const,
  },
  {
    name: "Fruitful Global™",
    slug: "fruitful-global",
    icon: "🌍",
    primaryColor: "#8b5cf6",
    description: "Core platform and orchestration across all sectors and brands",
    status: "active" as const,
  }
];

const initialSectors = [
  { name: "Healthcare & Medical", slug: "healthcare", description: "Medical services and healthcare solutions", brandSlug: "seedwave", status: "active" as const },
  { name: "Financial Services", slug: "financial", description: "Banking, fintech, and financial solutions", brandSlug: "vaultmesh", status: "active" as const },
  { name: "Technology & Software", slug: "technology", description: "Software development and tech solutions", brandSlug: "seedwave", status: "active" as const },
  { name: "Education & Training", slug: "education", description: "Learning platforms and educational resources", brandSlug: "banimal", status: "active" as const },
  { name: "Retail & E-commerce", slug: "retail", description: "Online retail and e-commerce platforms", brandSlug: "vaultmesh", status: "active" as const },
  { name: "Manufacturing", slug: "manufacturing", description: "Industrial and manufacturing solutions", brandSlug: "fruitful-global", status: "active" as const },
  { name: "Real Estate", slug: "real-estate", description: "Property management and real estate services", brandSlug: "vaultmesh", status: "active" as const },
  { name: "Transportation", slug: "transportation", description: "Logistics and transportation services", brandSlug: "fruitful-global", status: "active" as const },
  { name: "Energy & Utilities", slug: "energy", description: "Energy production and utility services", brandSlug: "seedwave", status: "active" as const },
  { name: "Agriculture", slug: "agriculture", description: "Farming and agricultural technology", brandSlug: "banimal", status: "active" as const },
  { name: "Entertainment", slug: "entertainment", description: "Media, gaming, and entertainment platforms", brandSlug: "banimal", status: "active" as const },
  { name: "Legal Services", slug: "legal", description: "Legal consultation and law firm services", brandSlug: "fruitful-global", status: "active" as const },
  { name: "Non-Profit", slug: "non-profit", description: "Charitable organizations and NGOs", brandSlug: "banimal", status: "active" as const },
  { name: "Government", slug: "government", description: "Public sector and government services", brandSlug: "fruitful-global", status: "active" as const },
  { name: "Hospitality", slug: "hospitality", description: "Hotels, restaurants, and travel services", brandSlug: "vaultmesh", status: "active" as const },
  { name: "Sports & Fitness", slug: "sports", description: "Athletic and fitness industry solutions", brandSlug: "banimal", status: "active" as const },
  { name: "Environmental", slug: "environmental", description: "Environmental and sustainability services", brandSlug: "seedwave", status: "active" as const },
  { name: "Media & Communications", slug: "media", description: "Broadcasting and communication services", brandSlug: "fruitful-global", status: "active" as const },
  { name: "Consulting", slug: "consulting", description: "Business consulting and advisory services", brandSlug: "seedwave", status: "active" as const },
  { name: "Research & Development", slug: "research", description: "R&D and innovation-focused organizations", brandSlug: "fruitful-global", status: "active" as const },
  { name: "Insurance", slug: "insurance", description: "Insurance and risk management services", brandSlug: "vaultmesh", status: "active" as const },
  { name: "Telecommunications", slug: "telecommunications", description: "Telecom and networking services", brandSlug: "seedwave", status: "active" as const },
  { name: "Construction", slug: "construction", description: "Construction and building services", brandSlug: "fruitful-global", status: "active" as const },
  { name: "Arts & Culture", slug: "arts", description: "Creative industries and cultural organizations", brandSlug: "banimal", status: "active" as const },
  { name: "Security Services", slug: "security", description: "Cybersecurity and physical security services", brandSlug: "vaultmesh", status: "active" as const },
  { name: "Aviation & Aerospace", slug: "aviation", description: "Aviation and aerospace industry solutions", brandSlug: "fruitful-global", status: "active" as const },
  { name: "Mining & Resources", slug: "mining", description: "Mining and natural resource extraction", brandSlug: "seedwave", status: "active" as const },
  { name: "Pharmaceuticals", slug: "pharmaceuticals", description: "Drug development and pharmaceutical services", brandSlug: "seedwave", status: "active" as const },
  { name: "Automotive", slug: "automotive", description: "Automotive industry and vehicle services", brandSlug: "vaultmesh", status: "active" as const }
];

const initialTemplates = [
  {
    name: "Banimal Footer",
    type: "footer_legal" as const,
    category: "Footer/Legal",
    htmlContent: banimalFooterTemplate,
    description: "Global impact footer featuring Banimal™ brand messaging",
    tags: ["footer", "global-impact", "banimal"],
    version: "1.0",
    isActive: true,
    brandSlug: "banimal",
    sectorSlug: "healthcare"
  },
  {
    name: "Enhanced VaultMesh Checkout",
    type: "checkout_payment" as const,
    category: "Checkout/Payment",
    htmlContent: vaultMeshCheckoutTemplate,
    description: "YOUR authentic Banimal Loop Checkout with complete Global Synergy Hub, language switcher, currency converter, and Banimal footer",
    tags: ["checkout", "payment", "vaultmesh", "banimal-loop", "global-synergy", "multi-language", "currency-converter"],
    version: "2.0",
    isActive: true,
    brandSlug: "vaultmesh",
    sectorSlug: "financial"
  },
  {
    name: "Advanced Sector Index Dashboard",
    type: "sector_index_dashboard" as const,
    category: "Sector Index/Dashboard",
    htmlContent: sectorIndexTemplate,
    description: "YOUR authentic complete business dashboard with OpenStreetMap integration, Chart.js visualizations, and advanced sector management",
    tags: ["dashboard", "sector-index", "openstreetmap", "charts", "analytics", "business-logic"],
    version: "2.0",
    isActive: true,
    brandSlug: "fruitful-global",
    sectorSlug: "technology"
  }
];

export { initialBrands, initialSectors, initialTemplates };

// Seed database function 
export async function seedDatabase() {
  const { storage } = await import("./storage");
  
  // Clear existing data and seed fresh
  try {
    // Create brands
    for (const brandData of initialBrands) {
      await storage.createBrand(brandData);
    }
    
    // Create sectors  
    for (const sectorData of initialSectors) {
      await storage.createSector(sectorData);
    }
    
    // Create templates with YOUR authentic content
    for (const templateData of initialTemplates) {
      await storage.createTemplate(templateData);
    }
    
    console.log("✅ Seeded database with YOUR authentic templates");
  } catch (error) {
    console.log("Database seed error:", error.message);
    throw error;
  }
}
