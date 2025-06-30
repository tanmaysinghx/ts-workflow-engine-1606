import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import healthRoutes from './routes/healthCheckRoute';
import { logger } from './middleware/logger';
import workflowRoutes from './routes/workflowRoutes';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(bodyParser.json());
app.use(helmet());
app.use(logger);

app.use('/v1/api/health', healthRoutes);
app.use('/v1/api/workflow', workflowRoutes);


export default app;
