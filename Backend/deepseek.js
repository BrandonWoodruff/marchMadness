import OpenAI from "openai";
import mqtt from 'mqtt';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

if (!process.env.DS_API_KEY || !process.env.DS_API_KEY.startsWith('sk-')) {
    console.error('Error: DS_API_KEY is not set correctly. It should start with "sk-"');
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: process.env.DS_API_KEY,
    defaultHeaders: {
        'Content-Type': 'application/json'
    },
    maxRetries: 3,
    timeout: 30000
});

// MQTT client setup
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('chatgpt/request');
});

client.on('message', async (topic, message) => {
    if (topic === 'chatgpt/request') {
        console.log('Received request:', message.toString());
        let request;
        try {
            request = JSON.parse(message.toString());
            
            if (!request || !request.prompt) {
                throw new Error('Invalid request format - missing prompt');
            }

            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a Sports Statistics Expert with 30 years of experience." },
                    { role: "user", content: request.prompt }
                ],
                model: "gpt-4",
                stream: false
            });

            const response = {
                requestId: request.id || 'unknown',
                content: completion.choices[0].message.content,
                usage: completion.usage
            };

            console.log('Sending response:', response);
            client.publish('chatgpt/response', JSON.stringify(response));
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                cause: error.cause,
                status: error.status,
                baseURL: openai.baseURL
            });
            const errorResponse = {
                requestId: request?.id || 'unknown',
                error: error.message || 'Unknown error occurred',
                status: error.status || 500,
                details: error.cause ? error.cause.code : undefined
            };
            client.publish('chatgpt/response', JSON.stringify(errorResponse));
        }
    }
});

client.on('error', (error) => {
    console.error('MQTT error:', error);
});