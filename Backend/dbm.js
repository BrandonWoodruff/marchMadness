import mqtt from 'mqtt';
import pkg from 'pg';
const { Pool } = pkg;

// Database configuration
const pool = new Pool({
    user: 'root',
    host: 'localhost',  // Changed from 'postgres' to 'localhost'
    database: 'marchMadness',
    password: 'root',
    port: 5432,
});

// Add after pool creation but before MQTT setup
const initializeDatabase = async () => {
    try {
        await pool.query(`
            CREATE SCHEMA IF NOT EXISTS "marchMadness";
            CREATE TABLE IF NOT EXISTS "marchMadness"."data_store" (
                datapath TEXT PRIMARY KEY,
                data JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Database schema initialized');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

// Call initialization
initializeDatabase();

// MQTT client setup
const client = mqtt.connect('mqtt://localhost:1883');  // Changed from mqtt_server to localhost

// Handle database connection
pool.connect((err, client, done) => {
    if (err) {
        console.error('Error connecting to the database', err);
    } else {
        console.log('Successfully connected to database');
    }
});

// MQTT connection handler
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    // Subscribe to save and get topics
    client.subscribe('save/#');
    client.subscribe('get/#');
});

// MQTT message handler
client.on('message', async (topic, message) => {
    const [action, ...pathParts] = topic.split('/');
    const datapath = pathParts.join('/');

    if (action === 'save') {
        try {
            const data = JSON.parse(message.toString());
            const query = 'INSERT INTO "marchMadness"."data_store" (datapath, data) VALUES ($1, $2) ON CONFLICT (datapath) DO UPDATE SET data = $2';
            await pool.query(query, [datapath, data]);
            console.log(`Saved data for path: ${datapath}`);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    // Modify the get handler for better debugging
    if (action === 'get') {
        try {
            console.log(`Attempting to retrieve data for path: ${datapath}`);
            const query = 'SELECT data FROM "marchMadness"."data_store" WHERE datapath = $1';
            const result = await pool.query(query, [datapath]);
            
            if (result.rows.length > 0) {
                console.log(`Found data for path: ${datapath}`);
                client.publish(`data/${datapath}`, JSON.stringify(result.rows[0].data));
            } else {
                console.log(`No data found for path: ${datapath}`);
                client.publish(`data/${datapath}`, JSON.stringify(null));
            }
        } catch (error) {
            console.error('Error retrieving data:', error);
            client.publish(`data/${datapath}`, JSON.stringify({ error: error.message }));
        }
    }
});

// Error handler
client.on('error', (error) => {
    console.error('MQTT error:', error);
});
