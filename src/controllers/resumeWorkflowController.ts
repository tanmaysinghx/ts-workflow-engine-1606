import { Request, Response, NextFunction } from 'express';
import { resumeWorkflow } from '../services/resumeWorkflowService';

export const resumeWorkflowController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const transactionId = req.params.transactionId;
    try {
        const result = await resumeWorkflow(transactionId);
        res.status(200).json(result);
    } catch (error) {
        const err = error as { transactionId?: string; message?: string };
        res.status(500).json({
            success: false,
            message: 'Workflow processing failed',
            transactionId: err.transactionId ?? null,
            errors: { general: err.message },
            data: null,
            meta: {
                timestamp: new Date().toISOString(),
                //apiVersion: version,
            },
        });
    }
};
