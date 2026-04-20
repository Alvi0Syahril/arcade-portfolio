import pool from '../db.js';

export const dbRepository = {
    async executeQuery(query: string): Promise<any> {
        // In PostgreSQL (pg), pool.query() handles getting and releasing a client automatically
        const result = await pool.query(query);
        return result.rows;
    },

    async logAIQuery(userQuery: string, generatedSql: string | null): Promise<void> {
        try {
            await pool.query(
                'INSERT INTO ai_logs (user_query, generated_sql) VALUES ($1, $2)',
                [userQuery, generatedSql]
            );
        } catch (error) {
            console.error('Failed to log AI query:', error);
        }
    }
};
