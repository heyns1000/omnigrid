INSERT INTO templates (id, name, type, version, content, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'VaultMesh™ Banimal Loop Checkout',
  'checkout_payment',
  'v2.0.0',
  '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌐 VaultMesh™ | Banimal Loop Checkout</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --fcu-color: #4CAF50;
            --secure-sign-purple: #8A2BE2;
            --secure-sign-blue: #4169E1;
            --bg-color-dark: #1a1a1c;
            --card-bg-dark: #2a2a2e;
            --text-color-dark: #f5f5f7;
            --border-color-dark: #3a3a3e;
        }
        body {
            font-family: "Inter", sans-serif;
            background-color: var(--bg-color-dark);
            color: var(--text-color-dark);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .checkout-header {
            background-color: var(--fcu-color);
            color: white;
            min-height: 150px;
            padding: 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .checkout-header h1 {
            font-size: 3.8rem;
            font-weight: 800;
            margin: 0;
            color: white;
        }
        .checkout-header .slogan {
            font-size: 1.5rem;
            margin-top: 10px;
            color: rgba(255, 255, 255, 0.9);
        }
        .main-content-area {
            flex-grow: 1;
            padding: 40px 20px;
            background-color: var(--bg-color-dark);
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        .checkout-card {
            background-color: var(--card-bg-dark);
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            border: 1px solid var(--border-color-dark);
        }
        .checkout-card h2 {
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-color-dark);
            text-align: center;
            margin-bottom: 30px;
        }
        .checkout-action-button {
            width: 100%;
            height: 56px;
            font-size: 1.125rem;
            font-weight: 700;
            color: white;
            border: none;
            border-radius: 9999px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 10px 0;
        }
        .checkout-action-button.purple {
            background-color: var(--secure-sign-purple);
        }
        .checkout-action-button.blue {
            background-color: var(--secure-sign-blue);
        }
        .form-input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid var(--border-color-dark);
            border-radius: 8px;
            background-color: #3a3a3e;
            color: var(--text-color-dark);
            font-size: 1rem;
            margin: 8px 0;
        }
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text-color-dark);
        }
        .order-summary {
            margin-bottom: 20px;
        }
        .order-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .order-total {
            display: flex;
            justify-content: space-between;
            font-weight: 700;
            font-size: 1.2rem;
            border-top: 1px solid var(--border-color-dark);
            padding-top: 10px;
            margin-top: 10px;
        }
    </style>
</head>
<body class="dark-mode">
    <header class="checkout-header">
        <div class="header-content-wrapper">
            <h1>VaultMesh™ | Banimal Loop</h1>
            <p class="slogan">Revolutionary checkout system with advanced payment processing</p>
        </div>
    </header>
    <main class="main-content-area">
        <div class="container">
            <div class="checkout-card">
                <h2>🔒 Secure Checkout</h2>
                <div class="order-summary">
                    <div class="order-item">
                        <span>VaultMesh™ Premium License</span>
                        <span>$2,997.00</span>
                    </div>
                    <div class="order-item">
                        <span>Banimal Loop Integration</span>
                        <span>$997.00</span>
                    </div>
                    <div class="order-total">
                        <span>Total</span>
                        <span>$3,994.00</span>
                    </div>
                </div>
                <form class="checkout-form">
                    <label class="form-label">First Name</label>
                    <input type="text" class="form-input" placeholder="Enter first name">
                    <label class="form-label">Last Name</label>
                    <input type="text" class="form-input" placeholder="Enter last name">
                    <label class="form-label">Email Address</label>
                    <input type="email" class="form-input" placeholder="Enter email address">
                    <button type="button" class="checkout-action-button purple">
                        🔒 Complete Purchase with PayPal
                    </button>
                    <button type="submit" class="checkout-action-button blue">
                        🛡️ Complete Secure Purchase
                    </button>
                </form>
            </div>
        </div>
    </main>
</body>
</html>',
  true,
  NOW(),
  NOW()
);
