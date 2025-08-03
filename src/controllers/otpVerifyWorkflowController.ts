import { Request, Response } from 'express';
import { otpVerifyService } from '../services/otpVerifyWorkflowService';

export const otpVerifyController = async (req: Request, res: Response) => {
    // Prefer extracting params from body if data is sensitive & not fit for URL path
    const { otp, emailId, transactionId } = req.params;
    // Optionally: const { otp, emailId, transactionId } = req.body;

    // Only include custom headers if required downstream, be careful with all headers
    // Suggestion: whitelist/pick specific ones if possible
    const headers = {
        authorization: req.headers['authorization'] || '',
        // ...add other headers needed downstream
    };

    try {
        const result = await otpVerifyService({ otp, emailId, transactionId, headers });
        res.status(200).json(result);
    } catch (error: any) {
        console.error(error);
        const statusCode = error?.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: 'Workflow processing failed',
            transactionId: error?.transactionId ?? null,
            errors: { general: error?.message },
            data: null,
            meta: {
                timestamp: new Date().toISOString(),
                apiVersion: "v1",
            },
        });
    }
};

