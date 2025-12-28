# 🔗 Three-Cube Banking Integration Guide

## Integrating with Fruitful Global Payment SSO Portal

This guide shows how to integrate the Three-Cube Lattice Banking System with your existing Fruitful Global Payment SSO Portal.

---

## 🎯 Integration Architecture

```
┌──────────────────────────────────────────────────────────────┐
│              Fruitful Global Payment SSO Portal              │
│         (f65787703_Fruitful_Global_Payment_SSO_Portal.html)  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Payment Flow Integration                              │ │
│  │  • User selects products                               │ │
│  │  • Payment initiated                                   │ │
│  │  • FCU transaction created  ──┐                        │ │
│  └────────────────────────────────│──────────────────────┘ │
└─────────────────────────────────────┼────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────┐
│           Three-Cube Lattice Banking System                  │
│                                                              │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐        │
│  │  Cube 1    │───►│  Cube 2    │───►│  Cube 3    │        │
│  │  Validate  │    │  Process   │    │  Audit     │        │
│  │  Infra     │    │  FCU Txn   │    │  Comply    │        │
│  └────────────┘    └────────────┘    └────────────┘        │
│                                                              │
│  Transaction ID returned                                     │
│  Real-time updates via WebSocket                             │
└──────────────────────────────────────────────────────────────┘
```

---

## 📦 Step 1: Add Banking Client to Portal

Add the Three-Cube client to your Fruitful Global Payment Portal HTML:

```html
<!-- In your f65787703_Fruitful_Global_Payment_SSO_Portal.html -->
<head>
    <!-- ... existing head content ... -->
    
    <!-- Add Three-Cube Banking Client -->
    <script src="three-cube-client.js"></script>
</head>

<body>
    <!-- ... existing portal content ... -->
    
    <script>
        // Initialize Three-Cube Banking Client
        const bankingClient = new ThreeCubeBankingClient(
            'http://localhost:3000',  // API URL
            'ws://localhost:8080'      // WebSocket URL
        );
        
        // Connect to banking system
        bankingClient.connect();
        
        // Listen for banking events
        bankingClient.on('transaction_event', (data) => {
            console.log('FCU Transaction:', data);
            updatePaymentStatus(data);
        });
    </script>
</body>
```

---

## 💰 Step 2: Integrate Payment Processing

When a user selects products and proceeds to payment:

```javascript
// In your existing payment processing function

async function processPayment(productSelection) {
    try {
        // 1. Calculate total amount
        const totalAmount = calculateTotal(productSelection);
        
        // 2. Get user's FCU account
        const userAccount = getUserFCUAccount(); // e.g., "ACC-USER-001"
        const merchantAccount = "ACC-MERCHANT-001"; // OmniGrid merchant
        
        // 3. Create FCU transaction via Three-Cube Banking
        const transaction = await bankingClient.createTransaction(
            userAccount,           // From: User's account
            merchantAccount,       // To: Merchant account
            totalAmount,           // Amount in FCU
            'product_purchase'     // Transaction type
        );
        
        // 4. Banking flow automatically routes through:
        //    Cube 1 (Infrastructure) → Cube 2 (Process) → Cube 3 (Audit)
        
        // 5. Update UI with transaction details
        showPaymentSuccess({
            transactionId: transaction.transaction_id,
            amount: totalAmount,
            status: transaction.status,
            cubeFlow: transaction.cube_flow
        });
        
        // 6. Activate licenses (your existing logic)
        await activateLicenses(productSelection, transaction.transaction_id);
        
        return transaction;
        
    } catch (error) {
        console.error('Payment failed:', error);
        showPaymentError(error.message);
        throw error;
    }
}
```

---

## 🎨 Step 3: Add Real-time Balance Display

Show user's FCU balance in the portal:

```javascript
// Add to your portal's initialization

async function initializeFCUBalance() {
    const userAccount = getUserFCUAccount();
    
    // Get accounts
    const accountsResponse = await bankingClient.getAccounts();
    const userAccountData = accountsResponse.accounts.find(
        acc => acc.account_id === userAccount
    );
    
    // Display balance
    const balanceElement = document.getElementById('fcuBalance');
    balanceElement.textContent = `${userAccountData.balance.toFixed(2)} FCU`;
    
    // Update on transactions
    bankingClient.on('transaction_event', async (data) => {
        if (data.from_account === userAccount || data.to_account === userAccount) {
            // Refresh balance
            const updated = await bankingClient.getAccounts();
            const newBalance = updated.accounts.find(
                acc => acc.account_id === userAccount
            ).balance;
            balanceElement.textContent = `${newBalance.toFixed(2)} FCU`;
        }
    });
}

// Call on page load
initializeFCUBalance();
```

---

## 📊 Step 4: Show Transaction History

Add a transaction history section to your portal:

```html
<!-- Add to your portal HTML -->
<div class="transaction-history">
    <h3>Recent Transactions</h3>
    <div id="transactionList"></div>
</div>

<style>
.transaction-item {
    padding: 15px;
    margin: 10px 0;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border-left: 3px solid #00d4ff;
}
</style>

<script>
async function loadTransactionHistory() {
    const userAccount = getUserFCUAccount();
    
    // Get metrics (includes recent transactions)
    const metrics = await bankingClient.getBankingMetrics();
    
    // Fetch detailed transaction data
    const response = await fetch('http://localhost:3000/api/cube2/transactions?account=' + userAccount);
    const transactions = await response.json();
    
    const listElement = document.getElementById('transactionList');
    listElement.innerHTML = transactions.map(txn => `
        <div class="transaction-item">
            <div><strong>ID:</strong> ${txn.transaction_id}</div>
            <div><strong>Amount:</strong> ${txn.fcu_amount} FCU</div>
            <div><strong>Type:</strong> ${txn.transaction_type}</div>
            <div><strong>Status:</strong> ${txn.status}</div>
            <div><strong>Date:</strong> ${new Date(txn.created_at).toLocaleString()}</div>
        </div>
    `).join('');
}
</script>
```

---

## 🔔 Step 5: Real-time Notifications

Add notifications for banking events:

```javascript
// Add notification system to your portal

function showBankingNotification(message, type = 'info') {
    // Your existing notification system or:
    const notification = document.createElement('div');
    notification.className = `banking-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(0, 212, 255, 0.2)'};
        border: 1px solid ${type === 'success' ? '#00ff88' : '#00d4ff'};
        border-radius: 8px;
        color: white;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Listen for banking events
bankingClient.on('transaction_event', (data) => {
    showBankingNotification(
        `Transaction ${data.transaction_id} completed: ${data.amount} FCU`,
        'success'
    );
});

bankingClient.on('flow_completed', (data) => {
    showBankingNotification('Banking flow completed successfully', 'success');
});
```

---

## 💳 Step 6: PayPal + FCU Integration

Integrate PayPal payments with FCU credits:

```javascript
// When user pays via PayPal, credit their FCU account

async function handlePayPalPayment(paypalTransaction) {
    try {
        // 1. Get PayPal payment amount (USD)
        const usdAmount = paypalTransaction.amount;
        
        // 2. Convert to FCU (example: 1 USD = 100 FCU)
        const fcuAmount = usdAmount * 100;
        
        // 3. Credit user's FCU account
        const transaction = await bankingClient.createTransaction(
            'ACC-MASTER-001',        // From: Master account
            getUserFCUAccount(),     // To: User's account
            fcuAmount,               // Amount in FCU
            'paypal_deposit'         // Transaction type
        );
        
        // 4. Show confirmation
        showBankingNotification(
            `Account credited with ${fcuAmount} FCU from PayPal payment`,
            'success'
        );
        
        return transaction;
        
    } catch (error) {
        console.error('FCU credit failed:', error);
        throw error;
    }
}
```

---

## 🎯 Step 7: Product Licensing Integration

When activating licenses, record in banking system:

```javascript
async function activateLicenseWithFCU(licenseData, transactionId) {
    try {
        // 1. Your existing license activation
        const license = await activateLicense(licenseData);
        
        // 2. Create audit trail in Cube 3
        await fetch('http://localhost:3000/api/cube3/audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_type: 'license_activation',
                entity_type: 'license',
                entity_id: license.id,
                action: 'License Activated',
                cube_source: 2,
                event_data: {
                    transaction_id: transactionId,
                    license_type: licenseData.type,
                    user: getUserAccount()
                }
            })
        });
        
        return license;
        
    } catch (error) {
        console.error('License activation failed:', error);
        throw error;
    }
}
```

---

## 📈 Step 8: Dashboard Integration

Add Three-Cube metrics to your portal dashboard:

```javascript
async function updateDashboardMetrics() {
    try {
        // Get all cube metrics
        const metrics = await bankingClient.getAllMetrics();
        
        // Update dashboard elements
        document.getElementById('fcuCirculation').textContent = 
            `${metrics.cube2.fcu_circulation.toLocaleString()} FCU`;
            
        document.getElementById('totalAccounts').textContent = 
            metrics.cube2.total_accounts.toLocaleString();
            
        document.getElementById('infraCharges').textContent = 
            `${metrics.total_infrastructure_charges.toLocaleString()} FCU/month`;
            
        // Show cube status
        document.getElementById('cubeStatus').innerHTML = `
            <div class="cube-status">
                🔷 Cube 1: ${metrics.cube1.avg_cpu}% CPU
                🔷 Cube 2: ${metrics.cube2.total_accounts} Accounts
                🔷 Cube 3: ${metrics.cube3.checks_24h} Checks (24h)
            </div>
        `;
        
    } catch (error) {
        console.error('Failed to update metrics:', error);
    }
}

// Update every 30 seconds
setInterval(updateDashboardMetrics, 30000);
updateDashboardMetrics(); // Initial load
```

---

## 🔐 Step 9: Authentication Integration

Link SSO with FCU accounts:

```javascript
async function onUserLogin(ssoUser) {
    try {
        // 1. Your existing SSO login
        const user = await authenticateSSO(ssoUser);
        
        // 2. Get or create FCU account
        let fcuAccount = await getFCUAccountForUser(user.id);
        
        if (!fcuAccount) {
            // Create new FCU account
            const response = await fetch('http://localhost:3000/api/cube2/accounts/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    account_name: user.email,
                    account_type: 'standard',
                    initial_balance: 0
                })
            });
            fcuAccount = await response.json();
        }
        
        // 3. Store FCU account in session
        sessionStorage.setItem('fcuAccount', fcuAccount.account_id);
        
        // 4. Initialize banking client
        await initializeFCUBalance();
        
        return { user, fcuAccount };
        
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}
```

---

## 🎨 Step 10: UI Enhancement

Add a Three-Cube status indicator to your portal:

```html
<!-- Add to your portal -->
<div class="cube-status-widget">
    <div class="cube-indicator" id="cube1Status">
        <div class="cube-icon">🔷</div>
        <div class="cube-label">DC Infra</div>
        <div class="cube-metric" id="cube1Metric">...</div>
    </div>
    <div class="cube-indicator" id="cube2Status">
        <div class="cube-icon">💰</div>
        <div class="cube-label">Banking</div>
        <div class="cube-metric" id="cube2Metric">...</div>
    </div>
    <div class="cube-indicator" id="cube3Status">
        <div class="cube-icon">🏦</div>
        <div class="cube-label">Bank DC</div>
        <div class="cube-metric" id="cube3Metric">...</div>
    </div>
</div>

<style>
.cube-status-widget {
    display: flex;
    gap: 20px;
    padding: 20px;
    background: rgba(26, 26, 46, 0.6);
    border-radius: 12px;
    margin: 20px 0;
}

.cube-indicator {
    flex: 1;
    text-align: center;
    padding: 15px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.cube-icon {
    font-size: 32px;
    margin-bottom: 10px;
}

.cube-label {
    font-size: 12px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 5px;
}

.cube-metric {
    font-size: 18px;
    font-weight: 600;
    color: #00d4ff;
}
</style>

<script>
// Update cube metrics
async function updateCubeStatus() {
    const metrics = await bankingClient.getAllMetrics();
    
    document.getElementById('cube1Metric').textContent = 
        `${metrics.cube1.avg_cpu}% CPU`;
    document.getElementById('cube2Metric').textContent = 
        `${(metrics.cube2.fcu_circulation / 1000000).toFixed(2)}M FCU`;
    document.getElementById('cube3Metric').textContent = 
        `${metrics.cube3.checks_24h} Checks`;
}

setInterval(updateCubeStatus, 10000);
</script>
```

---

## ✅ Complete Integration Checklist

- [ ] Add `three-cube-client.js` to portal
- [ ] Initialize `ThreeCubeBankingClient` on page load
- [ ] Connect WebSocket for real-time updates
- [ ] Integrate payment processing with FCU transactions
- [ ] Add FCU balance display
- [ ] Show transaction history
- [ ] Implement real-time notifications
- [ ] Integrate PayPal → FCU conversion
- [ ] Link license activation with audit trail
- [ ] Add Three-Cube metrics to dashboard
- [ ] Link SSO authentication with FCU accounts
- [ ] Add cube status indicators to UI

---

## 🎯 Expected User Flow

1. **User logs in** → SSO authentication + FCU account loaded
2. **User views balance** → Current FCU balance displayed
3. **User selects products** → OmniGrid, VaultMesh, etc.
4. **User proceeds to payment** → Payment options shown
5. **User pays with PayPal** → FCU account credited
6. **User purchases with FCU** → Transaction flows through all 3 cubes:
   - Cube 1: Infrastructure validates
   - Cube 2: Processes FCU transfer
   - Cube 3: Audits and complies
7. **Licenses activated** → Products enabled
8. **User sees confirmation** → Real-time notification
9. **Dashboard updates** → Balance, history, metrics refresh

---

## 🔧 Configuration Example

```javascript
// config.js - Add to your portal

const BANKING_CONFIG = {
    apiUrl: 'http://localhost:3000',        // Development
    wsUrl: 'ws://localhost:8080',            // Development
    
    // Production:
    // apiUrl: 'https://banking.seedwave.faa.zone',
    // wsUrl: 'wss://banking.seedwave.faa.zone/ws',
    
    fcuConversionRate: 100,  // 1 USD = 100 FCU
    
    merchantAccounts: {
        omnigrid: 'ACC-MERCHANT-001',
        vaultmesh: 'ACC-MERCHANT-002'
    },
    
    transactionTypes: {
        purchase: 'product_purchase',
        deposit: 'paypal_deposit',
        refund: 'refund',
        transfer: 'transfer'
    }
};

export default BANKING_CONFIG;
```

---

## 🎉 Benefits of Integration

1. **Unified Currency**: All transactions in FCU across ecosystem
2. **Real-time Updates**: Instant balance and transaction updates
3. **Audit Trail**: Complete history of all financial activities
4. **Infrastructure Transparency**: See exactly what you're paying for
5. **Compliance**: Automatic KYC/AML checks
6. **Scalability**: Distributed architecture handles growth
7. **Security**: Three-layer validation and audit
8. **Flexibility**: PayPal → FCU → Products seamless flow

---

## 📞 Support

For integration support:
1. Review `THREE-CUBE-README.md` for API details
2. Check `DEPLOYMENT.md` for setup instructions
3. Test endpoints at `/api/health`
4. Monitor WebSocket connection status
5. Check browser console for errors

---

**Fruitful™ Global Banking** + **Payment SSO Portal**  
*Complete Integration. Unified Experience.* 🌍💰

Ready to integrate! 🚀
