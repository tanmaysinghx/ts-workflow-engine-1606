import { Request, Response } from 'express';
import { processWorkflow } from '../services/workflowService';

export const handleWorkflowRequest = async (req: Request, res: Response) => {
    const { version, env, workflowCode } = req.params;
    const body = req.body;
    const headers = req.headers;

    try {
        const result = await processWorkflow({ version, env, workflowCode, body, headers });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        const err = error as { transactionId?: string; message?: string };
        res.status(500).json({
            success: false,
            message: 'Workflow processing failed',
            transactionId: err.transactionId ?? null,
            errors: { general: err.message },
            data: null,
            meta: {
                timestamp: new Date().toISOString(),
                apiVersion: version,
            },
        });
    }
};
