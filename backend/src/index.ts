
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Turso/Drizzle setup
const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});
export const db = drizzle(client);

// Basic health check endpoint
// Basic health check endpoint with Turso connection test
app.get('/health', async (req, res) => {
    try {
        await db.$client.execute('SELECT 1'); // Simple query to test connection
        res.status(200).json({ status: 'ok', message: 'Backend is running', dbConnection: 'successful' });
    } catch (error: any) {
        console.error('Database connection failed:', error);
        res.status(500).json({ status: 'error', message: 'Backend is running, but database connection failed', error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Access health check at http://localhost:${PORT}/health`);
});
