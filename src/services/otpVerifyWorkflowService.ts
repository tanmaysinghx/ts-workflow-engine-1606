import axios from 'axios';

interface OtpVerifyInput {
    otp: string;
    emailId: string;
    transactionId: string;
    body: any;
    headers: any;
}

export const otpVerifyService = async ({
    otp,
    emailId,
    transactionId,
    body,
    headers,
}: OtpVerifyInput) => {
    // 1. Verify OTP with notification service
    const otpVerificationUrl = 'http://localhost:1689/v2/api/notifications/verify-otp';

    try {
        const verifyOtpResp = await axios.post(
            otpVerificationUrl,
            {
                email: emailId,
                otpCode: otp,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!verifyOtpResp.data?.success) {
            throw new Error(verifyOtpResp.data?.message || 'OTP verification failed');
        }

        // 2. Resume workflow after OTP success
        const resumeWorkflowUrl = `http://localhost:1605/api-gateway/resume-workflow/${transactionId}`;

        const resumeResp = await axios.get(resumeWorkflowUrl, {
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
        });

        // 3. Return merged response
        return {
            success: true,
            message: 'OTP verified and workflow resumed successfully',
            otpServiceMessage: verifyOtpResp.data?.message,
            resumedWorkflow: resumeResp.data,
            transactionId,
            meta: {
                timestamp: new Date().toISOString(),
                apiVersion: 'v1',
            },
        };
    } catch (err: any) {
        const isAxios = axios.isAxiosError(err);
        const message = isAxios
            ? err.response?.data?.message ?? err.message
            : 'Unexpected error during OTP verification';

        const status = isAxios ? err.response?.status ?? 500 : 500;

        const error = new Error('OTP verification and workflow resume failed');
        (error as any).transactionId = transactionId;
        (error as any).statusCode = status;
        (error as any).message = message;
        throw error;
    }
};
