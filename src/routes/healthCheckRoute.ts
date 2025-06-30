import { Router, Request, Response } from 'express';
import { checkServiceHealth } from '../services/healthCheckService';

const router = Router();

router.get('/health-check', async (req: Request, res: Response) => {
    try {
        const healthChecks = await checkServiceHealth();
        res.json({
            status: 'healthy',
            services: healthChecks,
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            status: 'unhealthy',
            message: 'Error performing health check',
        });
    }
});

export default router;
