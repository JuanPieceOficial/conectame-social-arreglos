
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { users } from './schema';
import { eq } from 'drizzle-orm';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Turso/Drizzle setup
const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
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

// User registration endpoint
app.post('/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'User with that email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

        // Insert new user into database
        await db.insert(users).values({ username, email, passwordHash: hashedPassword });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration failed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// JWT Secret (should be in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// User login endpoint
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Find user by email
        const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (user.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const storedUser = user[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(password, storedUser.passwordHash);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: storedUser.id, email: storedUser.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Access health check at http://localhost:${PORT}/health`);
});
