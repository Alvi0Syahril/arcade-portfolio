import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { aiController } from './controllers/aiController.js';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = config.PORT;

// ── STANDARD SECURITY STACK ──────────────────────────────────────────────────

// 1. Morgan for automated request logging (Standard Auditing)
app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));

// 2. Helmet with Strict CSP (Standard Defense)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "https://unpkg.com"],
            "img-src": ["'self'", "data:", "https:"],
            "connect-src": ["'self'", "http://localhost:5000", config.FRONTEND_URL || ""],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        },
    },
    xPoweredBy: false, // Don't leak we're using Express
}));

// 3. Rate Limiting specifically for public visitors
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: config.NODE_ENV === 'production' ? 50 : 500,
    message: { error: 'Traffic spike detected from this IP. Please wait 15m.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/ai', limiter);

// 4. Strict CORS Whitelisting
const allowedOrigins = [
    'http://localhost:5173',
    config.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Cross-Origin Access Denied'));
        }
    }
}));

app.use(express.json());

// ── ROUTES ───────────────────────────────────────────────────────────────────
app.post('/api/ai/query', aiController);

// ── PRODUCTION STATIC SERVING ────────────────────────────────────────────────
if (config.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

// ── CENTRALIZED ERROR HANDLER (Hides secrets from attackers) ─────────────────
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(' [SYSTEM ERROR] ', err.stack);
    
    const statusCode = err.status || 500;
    const message = config.NODE_ENV === 'production' 
        ? 'A system error occurred. Our engineers have been notified.' 
        : err.message;

    res.status(statusCode).json({
        success: false,
        error: message
    });
});

app.listen(PORT, () => {
    console.log(`🛡️  SECURITY STANDARD ACTIVE | Server running on port ${PORT}`);
});
