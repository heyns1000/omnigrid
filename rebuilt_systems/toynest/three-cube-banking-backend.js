/**
 * Three-Cube Lattice Banking System - Backend
 * Fruitful™ Global Banking Infrastructure
 * 
 * Architecture:
 * - Cube 1: DC Infrastructure (Charged Services)
 * - Cube 2: Banking Core (FCU Operations)
 * - Cube 3: Bank DC Operations (Charged Services)
 */

import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database Configuration
const pool = new Pool({
    host: process.env.PGHOST || 'ep-super-math-afbz8ksj.c-2.us-west-2.aws.neon.tech',
    port: parseInt(process.env.PGPORT || '5432'),
    database: process.env.PGDATABASE || 'neondb',
    user: process.env.PGUSER || 'neondb_owner',
    password: process.env.PGPASSWORD || 'npg_gx7EfQwlJ9kz',
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ===== DATABASE INITIALIZATION =====

const initializeDatabase = async () => {
    const client = await pool.connect();
    try {
        console.log('🔧 Initializing Three-Cube Banking Database...');

        // CUBE 1: DC Infrastructure Tables
        await client.query(`
            CREATE TABLE IF NOT EXISTS cube1_infrastructure (
                id SERIAL PRIMARY KEY,
                service_type VARCHAR(100) NOT NULL,
                resource_name VARCHAR(200) NOT NULL,
                status VARCHAR(50) DEFAULT 'active',
                cpu_usage DECIMAL(5,2),
                ram_usage DECIMAL(5,2),
                network_throughput BIGINT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS cube1_charges (
                id SERIAL PRIMARY KEY,
                service_name VARCHAR(200) NOT NULL,
                charge_amount DECIMAL(15,2) NOT NULL,
                fcu_amount DECIMAL(15,2) NOT NULL,
                billing_period VARCHAR(50) DEFAULT 'monthly',
                charge_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metadata JSONB
            );
        `);

        // CUBE 2: Banking Core Tables
        await client.query(`
            CREATE TABLE IF NOT EXISTS cube2_fcu_accounts (
                account_id VARCHAR(100) PRIMARY KEY,
                account_name VARCHAR(200) NOT NULL,
                balance DECIMAL(18,2) DEFAULT 0.00,
                account_type VARCHAR(50) DEFAULT 'standard',
                status VARCHAR(50) DEFAULT 'active',
                kyc_verified BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS cube2_fcu_transactions (
                transaction_id VARCHAR(100) PRIMARY KEY,
                from_account VARCHAR(100),
                to_account VARCHAR(100),
                amount DECIMAL(18,2) NOT NULL,
                fcu_amount DECIMAL(18,2) NOT NULL,
                transaction_type VARCHAR(50) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                processing_node VARCHAR(100),
                cube_flow VARCHAR(200),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP,
                metadata JSONB
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS cube2_fcu_ledger (
                ledger_id SERIAL PRIMARY KEY,
                transaction_id VARCHAR(100) REFERENCES cube2_fcu_transactions(transaction_id),
                account_id VARCHAR(100) REFERENCES cube2_fcu_accounts(account_id),
                debit_amount DECIMAL(18,2),
                credit_amount DECIMAL(18,2),
                balance_after DECIMAL(18,2),
                ledger_hash VARCHAR(256),
                node_signature VARCHAR(256),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS cube2_subnodes (
                node_id VARCHAR(100) PRIMARY KEY,
                node_type VARCHAR(50) NOT NULL,
                node_name VARCHAR(200) NOT NULL,
                status VARCHAR(50) DEFAULT 'active',
                processing_capacity INTEGER DEFAULT 1000,
                current_load DECIMAL(5,2),
                location VARCHAR(100),
                cube_assignment INTEGER,
                last_heartbeat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metadata JSONB
            );
        `);

        // CUBE 3: Bank DC Operations Tables
        await client.query(`
            CREATE TABLE IF NOT EXISTS cube3_compliance_checks (
                check_id VARCHAR(100) PRIMARY KEY,
                transaction_id VARCHAR(100),
                account_id VARCHAR(100),
                check_type VARCHAR(100) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                risk_score DECIMAL(5,2),
                flagged BOOLEAN DEFAULT false,
                reviewed_by VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP,
                metadata JSONB
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS cube3_audit_trail (
                audit_id SERIAL PRIMARY KEY,
                event_type VARCHAR(100) NOT NULL,
                entity_type VARCHAR(100),
                entity_id VARCHAR(100),
                action VARCHAR(200) NOT NULL,
                performed_by VARCHAR(100),
                cube_source INTEGER,
                event_data JSONB,
                ip_address INET,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS cube3_charges (
                id SERIAL PRIMARY KEY,
                service_name VARCHAR(200) NOT NULL,
                charge_amount DECIMAL(15,2) NOT NULL,
                fcu_amount DECIMAL(15,2) NOT NULL,
                billing_period VARCHAR(50) DEFAULT 'monthly',
                charge_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metadata JSONB
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS cube3_backups (
                backup_id VARCHAR(100) PRIMARY KEY,
                backup_type VARCHAR(50) NOT NULL,
                data_size BIGINT,
                storage_location VARCHAR(200),
                status VARCHAR(50) DEFAULT 'completed',
                retention_days INTEGER DEFAULT 2555,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metadata JSONB
            );
        `);

        // Cross-Cube Tables
        await client.query(`
            CREATE TABLE IF NOT EXISTS banking_flows (
                flow_id VARCHAR(100) PRIMARY KEY,
                flow_type VARCHAR(100) NOT NULL,
                source_cube INTEGER,
                target_cube INTEGER,
                data_transferred BIGINT,
                status VARCHAR(50) DEFAULT 'in_progress',
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP,
                metadata JSONB
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS system_metrics (
                metric_id SERIAL PRIMARY KEY,
                cube_id INTEGER,
                metric_type VARCHAR(100),
                metric_value DECIMAL(18,2),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metadata JSONB
            );
        `);

        // Initialize Sample Data
        await initializeSampleData(client);

        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        throw error;
    } finally {
        client.release();
    }
};

const initializeSampleData = async (client) => {
    // Insert Infrastructure Services (Cube 1)
    await client.query(`
        INSERT INTO cube1_infrastructure (service_type, resource_name, status, cpu_usage, ram_usage, network_throughput)
        VALUES 
            ('load_balancer', 'LB-Primary-01', 'active', 45.5, 62.3, 850000000),
            ('load_balancer', 'LB-Primary-02', 'active', 48.2, 65.1, 920000000),
            ('storage', 'Storage-Node-01', 'active', 35.0, 55.0, 1500000000),
            ('storage', 'Storage-Node-02', 'active', 38.5, 58.2, 1600000000),
            ('compute', 'Compute-Fleet-01', 'active', 72.5, 78.9, 500000000),
            ('compute', 'Compute-Fleet-02', 'active', 68.0, 75.5, 480000000),
            ('network', 'Edge-Cache-01', 'active', 55.0, 60.0, 2500000000),
            ('security', 'WAF-Instance-01', 'active', 42.0, 50.5, 800000000)
        ON CONFLICT DO NOTHING;
    `);

    // Insert Infrastructure Charges (Cube 1)
    await client.query(`
        INSERT INTO cube1_charges (service_name, charge_amount, fcu_amount, billing_period, metadata)
        VALUES 
            ('Load Balancing Services', 12500.00, 12500.00, 'monthly', '{"nodes": 12, "requests": "450M/day"}'),
            ('Storage Services', 18000.00, 18000.00, 'monthly', '{"capacity": "425TB", "snapshots": "15min"}'),
            ('Compute Resources', 12000.00, 12000.00, 'monthly', '{"vcpus": 240, "ram": "960GB"}'),
            ('Network & CDN', 8000.00, 8000.00, 'monthly', '{"bandwidth": "18.5TB/day", "edge_nodes": 24}'),
            ('Security Services', 7500.00, 7500.00, 'monthly', '{"waf": true, "ddos": true, "ssl": true}')
        ON CONFLICT DO NOTHING;
    `);

    // Insert FCU Accounts (Cube 2)
    await client.query(`
        INSERT INTO cube2_fcu_accounts (account_id, account_name, balance, account_type, kyc_verified)
        VALUES 
            ('ACC-MASTER-001', 'Fruitful Global Master Account', 1247583.42, 'master', true),
            ('ACC-MERCHANT-001', 'OmniGrid Merchant Account', 85420.50, 'merchant', true),
            ('ACC-MERCHANT-002', 'VaultMesh Services', 125890.75, 'merchant', true),
            ('ACC-USER-001', 'Standard User Account', 5420.00, 'standard', true),
            ('ACC-USER-002', 'Standard User Account', 8950.25, 'standard', true),
            ('ACC-INFRA-001', 'Infrastructure Billing Account', 500000.00, 'system', true),
            ('ACC-COMPLIANCE-001', 'Compliance Services Account', 250000.00, 'system', true)
        ON CONFLICT DO NOTHING;
    `);

    // Insert Distributed Subnodes (Cube 2)
    await client.query(`
        INSERT INTO cube2_subnodes (node_id, node_type, node_name, processing_capacity, current_load, location, cube_assignment)
        VALUES 
            ('NODE-TXN-01', 'transaction', 'Transaction Node 01', 5000, 45.5, 'US-EAST', 2),
            ('NODE-TXN-02', 'transaction', 'Transaction Node 02', 5000, 48.2, 'US-WEST', 2),
            ('NODE-TXN-03', 'transaction', 'Transaction Node 03', 5000, 42.0, 'EU-CENTRAL', 2),
            ('NODE-LEDGER-01', 'ledger', 'Ledger Node 01', 3000, 35.5, 'US-EAST', 2),
            ('NODE-LEDGER-02', 'ledger', 'Ledger Node 02', 3000, 38.0, 'ASIA-PACIFIC', 2),
            ('NODE-GATEWAY-01', 'gateway', 'Payment Gateway 01', 2000, 55.0, 'US-EAST', 2),
            ('NODE-GATEWAY-02', 'gateway', 'Payment Gateway 02', 2000, 52.5, 'EU-WEST', 2),
            ('NODE-COMPLIANCE-01', 'compliance', 'Compliance Node 01', 1000, 28.5, 'US-EAST', 3),
            ('NODE-COMPLIANCE-02', 'compliance', 'Compliance Node 02', 1000, 32.0, 'EU-CENTRAL', 3)
        ON CONFLICT DO NOTHING;
    `);

    // Insert Bank DC Charges (Cube 3)
    await client.query(`
        INSERT INTO cube3_charges (service_name, charge_amount, fcu_amount, billing_period, metadata)
        VALUES 
            ('Compliance Services', 15000.00, 15000.00, 'monthly', '{"checks": "1.2M/day", "ai_monitoring": true}'),
            ('Backup & Disaster Recovery', 11200.00, 11200.00, 'monthly', '{"storage": "320TB", "rpo": "15min"}'),
            ('Audit & Reporting', 12000.00, 12000.00, 'monthly', '{"records": "15.8M", "reports": "450/day"}'),
            ('Archive Storage', 8000.00, 8000.00, 'monthly', '{"cold_storage": "500TB", "retention": "7yrs"}'),
            ('Reconciliation Services', 6500.00, 6500.00, 'monthly', '{"auto_matching": true, "daily": true}')
        ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Sample data initialized');
};

// ===== CUBE 1: DC INFRASTRUCTURE ENDPOINTS =====

// Get Infrastructure Status
app.get('/api/cube1/infrastructure', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM cube1_infrastructure 
            WHERE status = 'active'
            ORDER BY service_type, resource_name
        `);
        res.json({
            success: true,
            cube: 1,
            services: result.rows
        });
    } catch (error) {
        console.error('Error fetching infrastructure:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Infrastructure Charges
app.get('/api/cube1/charges', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM cube1_charges
            ORDER BY charge_date DESC
            LIMIT 50
        `);

        const total = await pool.query(`
            SELECT SUM(fcu_amount) as total_fcu
            FROM cube1_charges
            WHERE billing_period = 'monthly'
        `);

        res.json({
            success: true,
            cube: 1,
            charges: result.rows,
            total_monthly: parseFloat(total.rows[0].total_fcu || 0)
        });
    } catch (error) {
        console.error('Error fetching charges:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Record Infrastructure Usage
app.post('/api/cube1/usage', async (req, res) => {
    try {
        const { service_type, resource_name, cpu_usage, ram_usage, network_throughput } = req.body;

        await pool.query(`
            UPDATE cube1_infrastructure
            SET cpu_usage = $1, ram_usage = $2, network_throughput = $3, updated_at = CURRENT_TIMESTAMP
            WHERE service_type = $4 AND resource_name = $5
        `, [cpu_usage, ram_usage, network_throughput, service_type, resource_name]);

        res.json({
            success: true,
            cube: 1,
            message: 'Usage metrics updated'
        });
    } catch (error) {
        console.error('Error recording usage:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ===== CUBE 2: BANKING CORE ENDPOINTS =====

// Get FCU Accounts
app.get('/api/cube2/accounts', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT account_id, account_name, balance, account_type, status, kyc_verified
            FROM cube2_fcu_accounts
            WHERE status = 'active'
            ORDER BY balance DESC
        `);

        const total = await pool.query(`
            SELECT SUM(balance) as total_circulation
            FROM cube2_fcu_accounts
            WHERE status = 'active'
        `);

        res.json({
            success: true,
            cube: 2,
            accounts: result.rows,
            total_circulation: parseFloat(total.rows[0].total_circulation || 0)
        });
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create FCU Transaction
app.post('/api/cube2/transaction', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { from_account, to_account, amount, transaction_type } = req.body;
        const transaction_id = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Select processing node
        const nodeResult = await client.query(`
            SELECT node_id, node_name FROM cube2_subnodes
            WHERE node_type = 'transaction' AND status = 'active'
            ORDER BY current_load ASC
            LIMIT 1
        `);

        const processing_node = nodeResult.rows[0]?.node_id || 'NODE-TXN-01';

        // Create transaction through cube flow: 1 -> 2 -> 3
        const cube_flow = 'Cube1:Validation -> Cube2:Processing -> Cube3:Audit';

        // Insert transaction
        await client.query(`
            INSERT INTO cube2_fcu_transactions 
            (transaction_id, from_account, to_account, amount, fcu_amount, transaction_type, processing_node, cube_flow, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'processing')
        `, [transaction_id, from_account, to_account, amount, amount, transaction_type, processing_node, cube_flow]);

        // Update balances
        await client.query(`
            UPDATE cube2_fcu_accounts
            SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP
            WHERE account_id = $2
        `, [amount, from_account]);

        await client.query(`
            UPDATE cube2_fcu_accounts
            SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP
            WHERE account_id = $2
        `, [amount, to_account]);

        // Create ledger entries
        const fromBalance = await client.query(`SELECT balance FROM cube2_fcu_accounts WHERE account_id = $1`, [from_account]);
        const toBalance = await client.query(`SELECT balance FROM cube2_fcu_accounts WHERE account_id = $1`, [to_account]);

        await client.query(`
            INSERT INTO cube2_fcu_ledger (transaction_id, account_id, debit_amount, balance_after)
            VALUES ($1, $2, $3, $4)
        `, [transaction_id, from_account, amount, fromBalance.rows[0].balance]);

        await client.query(`
            INSERT INTO cube2_fcu_ledger (transaction_id, account_id, credit_amount, balance_after)
            VALUES ($1, $2, $3, $4)
        `, [transaction_id, to_account, amount, toBalance.rows[0].balance]);

        // Create banking flow record
        const flow_id = `FLOW-${Date.now()}`;
        await client.query(`
            INSERT INTO banking_flows (flow_id, flow_type, source_cube, target_cube, data_transferred, status)
            VALUES ($1, 'transaction', 1, 3, $2, 'completed')
        `, [flow_id, amount]);

        // Create audit trail (Cube 3)
        await client.query(`
            INSERT INTO cube3_audit_trail (event_type, entity_type, entity_id, action, cube_source, event_data)
            VALUES ('transaction', 'fcu_transaction', $1, 'FCU Transfer Completed', 2, $2)
        `, [transaction_id, JSON.stringify({ amount, from_account, to_account })]);

        // Complete transaction
        await client.query(`
            UPDATE cube2_fcu_transactions
            SET status = 'completed', completed_at = CURRENT_TIMESTAMP
            WHERE transaction_id = $1
        `, [transaction_id]);

        await client.query('COMMIT');

        res.json({
            success: true,
            cube: 2,
            transaction_id,
            processing_node,
            cube_flow,
            status: 'completed'
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating transaction:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        client.release();
    }
});

// Get Distributed Subnodes
app.get('/api/cube2/subnodes', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT node_id, node_type, node_name, status, processing_capacity, current_load, location, cube_assignment
            FROM cube2_subnodes
            WHERE status = 'active'
            ORDER BY node_type, current_load
        `);

        const stats = await pool.query(`
            SELECT 
                node_type,
                COUNT(*) as count,
                AVG(current_load) as avg_load
            FROM cube2_subnodes
            WHERE status = 'active'
            GROUP BY node_type
        `);

        res.json({
            success: true,
            cube: 2,
            subnodes: result.rows,
            statistics: stats.rows
        });
    } catch (error) {
        console.error('Error fetching subnodes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Banking Metrics
app.get('/api/cube2/metrics', async (req, res) => {
    try {
        const transactions = await pool.query(`
            SELECT COUNT(*) as total, 
                   COUNT(*) FILTER (WHERE status = 'completed') as completed,
                   COUNT(*) FILTER (WHERE status = 'pending') as pending,
                   SUM(fcu_amount) as total_volume
            FROM cube2_fcu_transactions
            WHERE created_at > NOW() - INTERVAL '24 hours'
        `);

        const accounts = await pool.query(`
            SELECT COUNT(*) as total_accounts,
                   SUM(balance) as total_circulation
            FROM cube2_fcu_accounts
            WHERE status = 'active'
        `);

        res.json({
            success: true,
            cube: 2,
            metrics: {
                transactions_24h: parseInt(transactions.rows[0].total),
                completed_24h: parseInt(transactions.rows[0].completed),
                pending: parseInt(transactions.rows[0].pending),
                volume_24h: parseFloat(transactions.rows[0].total_volume || 0),
                total_accounts: parseInt(accounts.rows[0].total_accounts),
                fcu_circulation: parseFloat(accounts.rows[0].total_circulation)
            }
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ===== CUBE 3: BANK DC OPERATIONS ENDPOINTS =====

// Get Compliance Checks
app.get('/api/cube3/compliance', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM cube3_compliance_checks
            ORDER BY created_at DESC
            LIMIT 100
        `);

        const stats = await pool.query(`
            SELECT 
                status,
                COUNT(*) as count,
                AVG(risk_score) as avg_risk
            FROM cube3_compliance_checks
            WHERE created_at > NOW() - INTERVAL '24 hours'
            GROUP BY status
        `);

        res.json({
            success: true,
            cube: 3,
            checks: result.rows,
            statistics: stats.rows
        });
    } catch (error) {
        console.error('Error fetching compliance checks:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create Compliance Check
app.post('/api/cube3/compliance/check', async (req, res) => {
    try {
        const { transaction_id, account_id, check_type } = req.body;
        const check_id = `CHK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const risk_score = Math.random() * 100; // Simulated risk scoring

        await pool.query(`
            INSERT INTO cube3_compliance_checks (check_id, transaction_id, account_id, check_type, risk_score, status)
            VALUES ($1, $2, $3, $4, $5, 'completed')
        `, [check_id, transaction_id, account_id, check_type, risk_score]);

        // Create audit trail
        await pool.query(`
            INSERT INTO cube3_audit_trail (event_type, entity_type, entity_id, action, cube_source, event_data)
            VALUES ('compliance', 'check', $1, 'Compliance Check Completed', 3, $2)
        `, [check_id, JSON.stringify({ check_type, risk_score })]);

        res.json({
            success: true,
            cube: 3,
            check_id,
            risk_score,
            status: risk_score < 70 ? 'approved' : 'flagged'
        });
    } catch (error) {
        console.error('Error creating compliance check:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Audit Trail
app.get('/api/cube3/audit', async (req, res) => {
    try {
        const { limit = 100, cube_source } = req.query;

        let query = `SELECT * FROM cube3_audit_trail`;
        const params = [];

        if (cube_source) {
            query += ` WHERE cube_source = $1`;
            params.push(cube_source);
        }

        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(limit);

        const result = await pool.query(query, params);

        res.json({
            success: true,
            cube: 3,
            audit_records: result.rows
        });
    } catch (error) {
        console.error('Error fetching audit trail:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Bank DC Charges
app.get('/api/cube3/charges', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM cube3_charges
            ORDER BY charge_date DESC
            LIMIT 50
        `);

        const total = await pool.query(`
            SELECT SUM(fcu_amount) as total_fcu
            FROM cube3_charges
            WHERE billing_period = 'monthly'
        `);

        res.json({
            success: true,
            cube: 3,
            charges: result.rows,
            total_monthly: parseFloat(total.rows[0].total_fcu || 0)
        });
    } catch (error) {
        console.error('Error fetching charges:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create Backup
app.post('/api/cube3/backup', async (req, res) => {
    try {
        const { backup_type, data_size } = req.body;
        const backup_id = `BKP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        await pool.query(`
            INSERT INTO cube3_backups (backup_id, backup_type, data_size, storage_location, status)
            VALUES ($1, $2, $3, $4, 'completed')
        `, [backup_id, backup_type, data_size, 'S3://fruitful-backups/']);

        // Create audit trail
        await pool.query(`
            INSERT INTO cube3_audit_trail (event_type, entity_type, entity_id, action, cube_source, event_data)
            VALUES ('backup', 'system', $1, 'Backup Created', 3, $2)
        `, [backup_id, JSON.stringify({ backup_type, data_size })]);

        res.json({
            success: true,
            cube: 3,
            backup_id,
            status: 'completed'
        });
    } catch (error) {
        console.error('Error creating backup:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ===== CROSS-CUBE ENDPOINTS =====

// Get Banking Flows Between Cubes
app.get('/api/flows', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM banking_flows
            ORDER BY started_at DESC
            LIMIT 100
        `);

        const stats = await pool.query(`
            SELECT 
                source_cube,
                target_cube,
                COUNT(*) as flow_count,
                SUM(data_transferred) as total_data
            FROM banking_flows
            WHERE started_at > NOW() - INTERVAL '24 hours'
            GROUP BY source_cube, target_cube
        `);

        res.json({
            success: true,
            flows: result.rows,
            statistics: stats.rows
        });
    } catch (error) {
        console.error('Error fetching flows:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Initiate Banking Flow Across All Cubes
app.post('/api/flows/initiate', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { flow_type, data_size } = req.body;
        const flow_id = `FLOW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Flow: Cube 1 (Infra) -> Cube 2 (Banking) -> Cube 3 (Bank DC)
        await client.query(`
            INSERT INTO banking_flows (flow_id, flow_type, source_cube, target_cube, data_transferred, status)
            VALUES ($1, $2, 1, 2, $3, 'in_progress')
        `, [flow_id + '-1-2', flow_type, data_size]);

        await client.query(`
            INSERT INTO banking_flows (flow_id, flow_type, source_cube, target_cube, data_transferred, status)
            VALUES ($1, $2, 2, 3, $3, 'in_progress')
        `, [flow_id + '-2-3', flow_type, data_size]);

        // Simulate processing delay
        setTimeout(async () => {
            const updateClient = await pool.connect();
            try {
                await updateClient.query(`
                    UPDATE banking_flows
                    SET status = 'completed', completed_at = CURRENT_TIMESTAMP
                    WHERE flow_id LIKE $1
                `, [flow_id + '%']);
            } finally {
                updateClient.release();
            }
        }, 2000);

        await client.query('COMMIT');

        res.json({
            success: true,
            flow_id,
            route: 'Cube 1 -> Cube 2 -> Cube 3',
            estimated_completion: '2 seconds'
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error initiating flow:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        client.release();
    }
});

// Get System-Wide Metrics
app.get('/api/metrics/all', async (req, res) => {
    try {
        const cube1 = await pool.query(`
            SELECT AVG(cpu_usage) as avg_cpu, AVG(ram_usage) as avg_ram, SUM(network_throughput) as total_network
            FROM cube1_infrastructure WHERE status = 'active'
        `);

        const cube2 = await pool.query(`
            SELECT COUNT(*) as total_accounts, SUM(balance) as total_fcu
            FROM cube2_fcu_accounts WHERE status = 'active'
        `);

        const cube3 = await pool.query(`
            SELECT COUNT(*) as total_checks, COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as checks_24h
            FROM cube3_compliance_checks
        `);

        const charges = await pool.query(`
            SELECT 
                (SELECT COALESCE(SUM(fcu_amount), 0) FROM cube1_charges WHERE billing_period = 'monthly') as cube1_charges,
                (SELECT COALESCE(SUM(fcu_amount), 0) FROM cube3_charges WHERE billing_period = 'monthly') as cube3_charges
        `);

        res.json({
            success: true,
            metrics: {
                cube1: {
                    avg_cpu: parseFloat(cube1.rows[0].avg_cpu || 0).toFixed(2),
                    avg_ram: parseFloat(cube1.rows[0].avg_ram || 0).toFixed(2),
                    total_network: parseInt(cube1.rows[0].total_network || 0),
                    monthly_charges: parseFloat(charges.rows[0].cube1_charges)
                },
                cube2: {
                    total_accounts: parseInt(cube2.rows[0].total_accounts),
                    fcu_circulation: parseFloat(cube2.rows[0].total_fcu || 0)
                },
                cube3: {
                    total_checks: parseInt(cube3.rows[0].total_checks),
                    checks_24h: parseInt(cube3.rows[0].checks_24h),
                    monthly_charges: parseFloat(charges.rows[0].cube3_charges)
                },
                total_infrastructure_charges: parseFloat(charges.rows[0].cube1_charges) + parseFloat(charges.rows[0].cube3_charges)
            }
        });
    } catch (error) {
        console.error('Error fetching all metrics:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health Check
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({
            success: true,
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'connected',
            cubes: {
                cube1: 'DC Infrastructure - Active',
                cube2: 'Banking Core - Active',
                cube3: 'Bank DC Operations - Active'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 'unhealthy',
            error: error.message
        });
    }
});

// Initialize and Start Server
const startServer = async () => {
    try {
        await initializeDatabase();
        
        app.listen(PORT, () => {
            console.log('');
            console.log('╔══════════════════════════════════════════════════════════╗');
            console.log('║   🏦 Three-Cube Lattice Banking System - ACTIVE         ║');
            console.log('╠══════════════════════════════════════════════════════════╣');
            console.log(`║   🌐 Server:        http://localhost:${PORT}              ║`);
            console.log('║   🔷 Cube 1:        DC Infrastructure (Charging)        ║');
            console.log('║   🔷 Cube 2:        Banking Core (FCU Operations)       ║');
            console.log('║   🔷 Cube 3:        Bank DC Operations (Charging)       ║');
            console.log('╠══════════════════════════════════════════════════════════╣');
            console.log('║   📊 API Endpoints:                                      ║');
            console.log('║      GET  /api/cube1/infrastructure                     ║');
            console.log('║      GET  /api/cube1/charges                            ║');
            console.log('║      GET  /api/cube2/accounts                           ║');
            console.log('║      POST /api/cube2/transaction                        ║');
            console.log('║      GET  /api/cube2/subnodes                           ║');
            console.log('║      GET  /api/cube3/compliance                         ║');
            console.log('║      GET  /api/cube3/audit                              ║');
            console.log('║      GET  /api/cube3/charges                            ║');
            console.log('║      GET  /api/flows                                     ║');
            console.log('║      POST /api/flows/initiate                           ║');
            console.log('║      GET  /api/metrics/all                              ║');
            console.log('╚══════════════════════════════════════════════════════════╝');
            console.log('');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;
