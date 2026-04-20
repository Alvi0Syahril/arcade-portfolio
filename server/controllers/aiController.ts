import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { aiService } from '../services/aiService.js';

// Define strict validation schema for visitor queries
const querySchema = z.object({
    query: z.string().min(1, "Question cannot be empty").max(1000, "Question is too long")
});

export const aiController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Validate input against standard schema
        const parsed = querySchema.safeParse(req.body);
        
        if (!parsed.success) {
            res.status(400).json({ 
                success: false, 
                error: 'Invalid request', 
                details: parsed.error.format() 
            });
            return;
        }

        const { query } = parsed.data;
        const result = await aiService.processUserQuery(query);

        if (result.type === 'table') {
            res.status(200).json({
                success: true,
                type: 'table',
                sql_used: result.sql,
                data: result.data,
            });
        } else {
            res.status(200).json({
                success: true,
                type: 'text',
                answer: result.answer,
            });
        }

    } catch (error) {
        // Hand off to central error handler
        next(error);
    }
};
