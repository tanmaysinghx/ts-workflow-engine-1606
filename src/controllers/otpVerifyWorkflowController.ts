import { Request, Response } from 'express';
import { otpVerifyService } from '../services/otpVerifyWorkflowService';

export const otpVerifyController = async (req: Request, res: Response) => {
    const { otp, emailId, transactionId } = req.params;
    const body = req.body;
    const headers = req.headers;

    try {
        const result = await otpVerifyService({ otp, emailId, transactionId, body, headers });
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
                apiVersion: "v1",
            },
        });
    }
}
