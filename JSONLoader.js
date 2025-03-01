import mqtt from 'mqtt';
import fs from 'fs';

// Connect to MQTT broker
const client = mqtt.connect('mqtt://localhost:1883');

// Read and process the JSON file
const processTeamStats = async () => {
    try {
        // Read the JSON file
        const rawData = fs.readFileSync('./processed_team_stats_2019_2024 1.json');
        const teams = JSON.parse(rawData);

        // Filter for teams that made the tournament and publish to MQTT
        teams.forEach(team => {
            if (team.MadeTournament === true) {
                // Construct the path using TournamentRegion/Season/TournamentSeed
                const datapath = `${team.TournamentRegion}/${team.Season}/${team.TournamentSeed}`;
                
                // Publish to MQTT save topic
                client.publish(`save/${datapath}`, JSON.stringify(team));
                console.log(`Published team data to path: ${datapath}`);
            }
        });

        // Close MQTT connection after slight delay to ensure messages are sent
        setTimeout(() => {
            client.end();
            console.log('Finished processing teams');
        }, 1000);

    } catch (error) {
        console.error('Error processing team stats:', error);
        client.end();
    }
};

// Handle MQTT connection
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    processTeamStats();
});

// Handle MQTT errors
client.on('error', (error) => {
    console.error('MQTT error:', error);
    client.end();
});
