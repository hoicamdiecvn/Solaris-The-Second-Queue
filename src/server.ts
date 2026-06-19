import express from 'express';
import cors from 'cors';
import pidusage from 'pidusage';

export function startDashboardServer() {
    const app = express();
    const port = 3000;

    app.use(cors());

    app.get('/api/stats', async (req, res) => {
        try {
            const stats = await pidusage(process.pid);
            
            res.json({
                cpu: stats.cpu,
                ram: stats.memory / 1024 / 1024,
                uptime: process.uptime()
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch stats' });
        }
    });

    app.listen(port, () => {
        console.log(`[Dashboard API] Đang chạy tại http://localhost:${port}`);
    });
}