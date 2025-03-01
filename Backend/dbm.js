const mqtt = require('mqtt');
const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
    user: 'root',
    host: 'localhost',  // Changed from 'postgres' to 'localhost'
    database: 'marchMadness',
    password: 'root',
    port: 5432,
});

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

    if (action === 'get') {
        try {
            const query = 'SELECT data FROM "marchMadness"."data_store" WHERE datapath = $1';
            const result = await pool.query(query, [datapath]);
            
            if (result.rows.length > 0) {
                // Publish the data back
                client.publish(`data/${datapath}`, JSON.stringify(result.rows[0].data));
                console.log(`Retrieved and published data for path: ${datapath}`);
            } else {
                client.publish(`data/${datapath}`, JSON.stringify(null));
            }
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    }
});

// Error handler
client.on('error', (error) => {
    console.error('MQTT error:', error);
});
