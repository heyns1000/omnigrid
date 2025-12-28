/**
 * Three-Cube Lattice Banking System - Frontend Client
 * Handles WebSocket connections and API calls
 */

class ThreeCubeBankingClient {
    constructor(apiUrl = 'http://localhost:3000', wsUrl = 'ws://localhost:8080') {
        this.apiUrl = apiUrl;
        this.wsUrl = wsUrl;
        this.ws = null;
        this.reconnectInterval = 5000;
        this.eventHandlers = {};
        this.cubeId = null;
    }

    // ===== WebSocket Methods =====

    connect(cubeId = null) {
        this.cubeId = cubeId;
        this.ws = new WebSocket(this.wsUrl);

        this.ws.onopen = () => {
            console.log('🔗 Connected to Three-Cube Banking WebSocket');
            this.updateConnectionStatus('connected');

            if (this.cubeId) {
                this.registerToCube(this.cubeId);
            }

            this.trigger('connected', { cubeId: this.cubeId });
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📨 Received:', data.type, data);
                
                this.handleMessage(data);
                this.trigger(data.type, data);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('🔌 WebSocket disconnected');
            this.updateConnectionStatus('disconnected');
            this.trigger('disconnected');
            
            // Auto-reconnect
            setTimeout(() => {
                console.log('🔄 Attempting to reconnect...');
                this.connect(this.cubeId);
            }, this.reconnectInterval);
        };

        this.ws.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
            this.updateConnectionStatus('error');
        };
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    registerToCube(cubeId) {
        this.send({
            type: 'register',
            cubeId: cubeId
        });
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket not connected');
        }
    }

    handleMessage(data) {
        switch (data.type) {
            case 'transaction_event':
                this.displayTransaction(data);
                break;
            case 'flow_initiated':
                this.displayFlowInitiated(data);
                break;
            case 'flow_completed':
                this.displayFlowCompleted(data);
                break;
            case 'periodic_metrics':
                this.updateMetrics(data.data);
                break;
            case 'activity':
                this.displayActivity(data);
                break;
            case 'sync_completed':
                this.displayNotification('✅ All cubes synchronized', 'success');
                break;
        }
    }

    on(event, handler) {
        if (!this.eventHandlers[event]) {
            this.eventHandlers[event] = [];
        }
        this.eventHandlers[event].push(handler);
    }

    trigger(event, data) {
        if (this.eventHandlers[event]) {
            this.eventHandlers[event].forEach(handler => handler(data));
        }
    }

    // ===== API Methods =====

    async apiCall(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.apiUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`API call failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    }

    // Cube 1: Infrastructure
    async getInfrastructure() {
        return await this.apiCall('/api/cube1/infrastructure');
    }

    async getInfraCharges() {
        return await this.apiCall('/api/cube1/charges');
    }

    // Cube 2: Banking Core
    async getAccounts() {
        return await this.apiCall('/api/cube2/accounts');
    }

    async createTransaction(from_account, to_account, amount, transaction_type) {
        return await this.apiCall('/api/cube2/transaction', {
            method: 'POST',
            body: JSON.stringify({ from_account, to_account, amount, transaction_type })
        });
    }

    async getSubnodes() {
        return await this.apiCall('/api/cube2/subnodes');
    }

    async getBankingMetrics() {
        return await this.apiCall('/api/cube2/metrics');
    }

    // Cube 3: Bank DC
    async getCompliance() {
        return await this.apiCall('/api/cube3/compliance');
    }

    async createComplianceCheck(transaction_id, account_id, check_type) {
        return await this.apiCall('/api/cube3/compliance/check', {
            method: 'POST',
            body: JSON.stringify({ transaction_id, account_id, check_type })
        });
    }

    async getAuditTrail(limit = 100) {
        return await this.apiCall(`/api/cube3/audit?limit=${limit}`);
    }

    async getBankDCCharges() {
        return await this.apiCall('/api/cube3/charges');
    }

    // Cross-Cube
    async getBankingFlows() {
        return await this.apiCall('/api/flows');
    }

    async initiateBankingFlow(flow_type, data_size) {
        return await this.apiCall('/api/flows/initiate', {
            method: 'POST',
            body: JSON.stringify({ flow_type, data_size })
        });
    }

    async getAllMetrics() {
        return await this.apiCall('/api/metrics/all');
    }

    async healthCheck() {
        return await this.apiCall('/api/health');
    }

    // ===== UI Update Methods =====

    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `status-${status}`;
        }
    }

    displayTransaction(data) {
        console.log('💰 Transaction:', data);
        this.displayNotification(
            `Transaction ${data.transaction_id}: ${data.amount} FCU from ${data.from_account} to ${data.to_account}`,
            'info'
        );
    }

    displayFlowInitiated(data) {
        console.log('🔄 Flow initiated:', data);
        this.displayNotification(
            `Banking flow initiated: Cube ${data.source_cube} → Cube ${data.target_cube}`,
            'info'
        );
    }

    displayFlowCompleted(data) {
        console.log('✅ Flow completed:', data);
        this.displayNotification('Banking flow completed successfully', 'success');
    }

    updateMetrics(metrics) {
        // Update FCU circulation
        const fcuElement = document.getElementById('fcuAmount');
        if (fcuElement && metrics.cube2) {
            fcuElement.textContent = metrics.cube2.fcu_circulation.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        // You can add more metric updates here
        console.log('📊 Metrics updated:', metrics);
    }

    displayActivity(data) {
        const feed = document.getElementById('activityFeed');
        if (!feed) return;

        const item = document.createElement('div');
        item.className = `activity-item cube${data.cube}`;
        
        const cubeLabels = {
            1: 'DC Infrastructure',
            2: 'Banking Core',
            3: 'Bank DC'
        };

        item.innerHTML = `
            <div class="activity-time">${new Date(data.timestamp).toLocaleTimeString()}</div>
            <div class="activity-text">
                <strong>${cubeLabels[data.cube]}:</strong> ${data.message}
            </div>
        `;

        feed.insertBefore(item, feed.firstChild);

        // Keep only last 10 items
        while (feed.children.length > 10) {
            feed.removeChild(feed.lastChild);
        }
    }

    displayNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notificationContainer = document.getElementById('notifications');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notifications';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(notificationContainer);
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${type === 'success' ? 'rgba(0, 255, 136, 0.1)' : 
                         type === 'error' ? 'rgba(255, 68, 68, 0.1)' : 
                         'rgba(0, 212, 255, 0.1)'};
            border: 1px solid ${type === 'success' ? '#00ff88' : 
                               type === 'error' ? '#ff4444' : 
                               '#00d4ff'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
        notification.textContent = message;

        notificationContainer.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // ===== Utility Methods =====

    requestMetrics() {
        this.send({ type: 'metrics_request' });
    }

    requestSync() {
        this.send({ type: 'sync_request' });
    }

    simulateTransaction() {
        this.createTransaction(
            'ACC-USER-001',
            'ACC-USER-002',
            Math.random() * 1000,
            'transfer'
        ).then(result => {
            console.log('Transaction created:', result);
            this.displayNotification('✅ Transaction completed successfully', 'success');
        }).catch(error => {
            console.error('Transaction failed:', error);
            this.displayNotification('❌ Transaction failed', 'error');
        });
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .status-connected {
        color: #00ff88;
    }

    .status-disconnected {
        color: #ff4444;
    }

    .status-error {
        color: #ffaa00;
    }
`;
document.head.appendChild(style);

// Export for use in HTML
window.ThreeCubeBankingClient = ThreeCubeBankingClient;

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
    console.log('🏦 Three-Cube Banking Client loaded');
}
