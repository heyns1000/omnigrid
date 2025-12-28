/**
 * Three-Cube Lattice WebSocket Service
 * Real-time synchronization between DC Infrastructure, Banking Core, and Bank DC
 */

import WebSocket from 'ws';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const WS_PORT = process.env.WS_PORT || 8080;

// Database Configuration
const pool = new Pool({
    host: process.env.PGHOST || 'ep-super-math-afbz8ksj.c-2.us-west-2.aws.neon.tech',
    port: parseInt(process.env.PGPORT || '5432'),
    database: process.env.PGDATABASE || 'neondb',
    user: process.env.PGUSER || 'neondb_owner',
    password: process.env.PGPASSWORD || 'npg_gx7EfQwlJ9kz',
    ssl: { rejectUnauthorized: false }
});

// WebSocket Server
const wss = new WebSocket.Server({ port: WS_PORT });

// Connected clients by cube
const cubeConnections = {
    cube1: new Set(), // DC Infrastructure
    cube2: new Set(), // Banking Core
    cube3: new Set()  // Bank DC
};

const allConnections = new Set();

// Broadcast to all clients
const broadcast = (data) => {
    const message = JSON.stringify(data);
    allConnections.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

// Broadcast to specific cube
const broadcastToCube = (cubeId, data) => {
    const message = JSON.stringify(data);
    const cube = cubeConnections[`cube${cubeId}`];
    if (cube) {
        cube.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
};

// Handle new connections
wss.on('connection', (ws, req) => {
    console.log(`🔗 New WebSocket connection from ${req.socket.remoteAddress}`);
    allConnections.add(ws);

    // Send welcome message
    ws.send(JSON.stringify({
        type: 'connection',
        status: 'connected',
        message: 'Connected to Three-Cube Lattice Banking System',
        timestamp: new Date().toISOString()
    }));

    // Handle messages from clients
    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            
            switch (data.type) {
                case 'register':
                    handleCubeRegistration(ws, data);
                    break;
                case 'transaction':
                    await handleTransaction(data);
                    break;
                case 'flow_initiate':
                    await handleFlowInitiation(data);
                    break;
                case 'metrics_request':
                    await sendMetrics(ws);
                    break;
                case 'sync_request':
                    await syncAllCubes();
                    break;
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error handling message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                error: error.message
            }));
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log('🔌 Client disconnected');
        allConnections.delete(ws);
        
        // Remove from cube connections
        Object.values(cubeConnections).forEach(cube => {
            cube.delete(ws);
        });
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Register client to specific cube
const handleCubeRegistration = (ws, data) => {
    const { cubeId } = data;
    
    if (cubeId >= 1 && cubeId <= 3) {
        cubeConnections[`cube${cubeId}`].add(ws);
        console.log(`✅ Client registered to Cube ${cubeId}`);
        
        ws.send(JSON.stringify({
            type: 'registered',
            cubeId,
            message: `Successfully registered to Cube ${cubeId}`,
            timestamp: new Date().toISOString()
        }));
    }
};

// Handle transaction events
const handleTransaction = async (data) => {
    const { transaction_id, from_account, to_account, amount, processing_node } = data;
    
    // Broadcast transaction event
    broadcast({
        type: 'transaction_event',
        transaction_id,
        from_account,
        to_account,
        amount,
        processing_node,
        cube_flow: 'Cube1 -> Cube2 -> Cube3',
        timestamp: new Date().toISOString()
    });

    // Create banking flow across cubes
    const flow_id = `FLOW-${Date.now()}`;
    await pool.query(`
        INSERT INTO banking_flows (flow_id, flow_type, source_cube, target_cube, data_transferred, status)
        VALUES ($1, 'transaction_sync', 1, 3, $2, 'completed')
    `, [flow_id, amount]);

    console.log(`💰 Transaction ${transaction_id}: ${amount} FCU broadcasted`);
};

// Handle flow initiation
const handleFlowInitiation = async (data) => {
    const { flow_type, source_cube, target_cube } = data;
    const flow_id = `FLOW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
        await pool.query(`
            INSERT INTO banking_flows (flow_id, flow_type, source_cube, target_cube, data_transferred, status)
            VALUES ($1, $2, $3, $4, 1024000, 'in_progress')
        `, [flow_id, flow_type, source_cube, target_cube]);

        broadcast({
            type: 'flow_initiated',
            flow_id,
            flow_type,
            source_cube,
            target_cube,
            status: 'in_progress',
            timestamp: new Date().toISOString()
        });

        // Simulate flow completion
        setTimeout(async () => {
            await pool.query(`
                UPDATE banking_flows
                SET status = 'completed', completed_at = CURRENT_TIMESTAMP
                WHERE flow_id = $1
            `, [flow_id]);

            broadcast({
                type: 'flow_completed',
                flow_id,
                status: 'completed',
                timestamp: new Date().toISOString()
            });
        }, 2000);

        console.log(`🔄 Flow initiated: Cube ${source_cube} -> Cube ${target_cube}`);
    } catch (error) {
        console.error('Error initiating flow:', error);
    }
};

// Send metrics to client
const sendMetrics = async (ws) => {
    try {
        const cube1 = await pool.query(`
            SELECT AVG(cpu_usage) as avg_cpu, AVG(ram_usage) as avg_ram
            FROM cube1_infrastructure WHERE status = 'active'
        `);

        const cube2 = await pool.query(`
            SELECT COUNT(*) as total_accounts, SUM(balance) as total_fcu
            FROM cube2_fcu_accounts WHERE status = 'active'
        `);

        const cube3 = await pool.query(`
            SELECT COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as checks_24h
            FROM cube3_compliance_checks
        `);

        const transactions = await pool.query(`
            SELECT COUNT(*) as total_transactions
            FROM cube2_fcu_transactions
            WHERE created_at > NOW() - INTERVAL '1 hour'
        `);

        ws.send(JSON.stringify({
            type: 'metrics',
            data: {
                cube1: {
                    avg_cpu: parseFloat(cube1.rows[0].avg_cpu || 0).toFixed(2),
                    avg_ram: parseFloat(cube1.rows[0].avg_ram || 0).toFixed(2)
                },
                cube2: {
                    total_accounts: parseInt(cube2.rows[0].total_accounts),
                    fcu_circulation: parseFloat(cube2.rows[0].total_fcu || 0),
                    transactions_1h: parseInt(transactions.rows[0].total_transactions)
                },
                cube3: {
                    checks_24h: parseInt(cube3.rows[0].checks_24h)
                }
            },
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        console.error('Error sending metrics:', error);
    }
};

// Synchronize all cubes
const syncAllCubes = async () => {
    try {
        const flow_id = `SYNC-${Date.now()}`;

        // Create sync flows
        await pool.query(`
            INSERT INTO banking_flows (flow_id, flow_type, source_cube, target_cube, data_transferred, status)
            VALUES 
                ($1 || '-1-2', 'sync', 1, 2, 1024000, 'completed'),
                ($1 || '-2-3', 'sync', 2, 3, 1024000, 'completed'),
                ($1 || '-1-3', 'sync', 1, 3, 1024000, 'completed')
        `, [flow_id]);

        broadcast({
            type: 'sync_completed',
            flow_id,
            synced_cubes: [1, 2, 3],
            timestamp: new Date().toISOString()
        });

        console.log(`🔄 All cubes synchronized: ${flow_id}`);
    } catch (error) {
        console.error('Error syncing cubes:', error);
    }
};

// Periodic metrics broadcast
setInterval(async () => {
    try {
        const metrics = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM cube1_infrastructure WHERE status = 'active') as infra_count,
                (SELECT SUM(balance) FROM cube2_fcu_accounts WHERE status = 'active') as fcu_circulation,
                (SELECT COUNT(*) FROM cube3_compliance_checks WHERE created_at > NOW() - INTERVAL '1 hour') as recent_checks
        `);

        const txnRate = await pool.query(`
            SELECT COUNT(*) as count
            FROM cube2_fcu_transactions
            WHERE created_at > NOW() - INTERVAL '1 minute'
        `);

        broadcast({
            type: 'periodic_metrics',
            data: {
                infra_services: parseInt(metrics.rows[0].infra_count),
                fcu_circulation: parseFloat(metrics.rows[0].fcu_circulation || 0),
                recent_compliance_checks: parseInt(metrics.rows[0].recent_checks),
                transactions_per_minute: parseInt(txnRate.rows[0].count),
                tps: (parseInt(txnRate.rows[0].count) / 60).toFixed(2)
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error broadcasting metrics:', error);
    }
}, 10000); // Every 10 seconds

// Simulate banking activity
const simulateBankingActivity = async () => {
    const activities = [
        { cube: 1, type: 'infra', message: 'Load balancer scaled up' },
        { cube: 2, type: 'banking', message: 'Transaction batch processed' },
        { cube: 3, type: 'compliance', message: 'Compliance check completed' },
        { cube: 1, type: 'storage', message: 'Storage snapshot created' },
        { cube: 2, type: 'payment', message: 'Payment gateway settlement' },
        { cube: 3, type: 'audit', message: 'Audit trail updated' }
    ];

    setInterval(() => {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        broadcast({
            type: 'activity',
            cube: activity.cube,
            activity_type: activity.type,
            message: activity.message,
            timestamp: new Date().toISOString()
        });
    }, 5000);
};

// Start simulated activity
if (process.env.SIMULATE_ACTIVITY === 'true') {
    simulateBankingActivity();
}

console.log('');
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   🌐 Three-Cube Lattice WebSocket Service - ACTIVE       ║');
console.log('╠═══════════════════════════════════════════════════════════╣');
console.log(`║   📡 WebSocket Port:  ${WS_PORT}                              ║`);
console.log('║   🔷 Cube 1:          DC Infrastructure                   ║');
console.log('║   🔷 Cube 2:          Banking Core                       ║');
console.log('║   🔷 Cube 3:          Bank DC Operations                 ║');
console.log('╠═══════════════════════════════════════════════════════════╣');
console.log('║   📊 Event Types:                                         ║');
console.log('║      • transaction_event    - FCU transactions            ║');
console.log('║      • flow_initiated       - Cube-to-cube flows          ║');
console.log('║      • flow_completed       - Flow completions            ║');
console.log('║      • sync_completed       - Cube synchronization        ║');
console.log('║      • periodic_metrics     - Real-time metrics           ║');
console.log('║      • activity             - Banking activities          ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');
console.log(`🚀 WebSocket server listening on ws://localhost:${WS_PORT}`);
console.log('');

// Handle shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Shutting down WebSocket server...');
    wss.close(() => {
        console.log('✅ WebSocket server closed');
        pool.end();
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 Shutting down WebSocket server...');
    wss.close(() => {
        console.log('✅ WebSocket server closed');
        pool.end();
        process.exit(0);
    });
});
