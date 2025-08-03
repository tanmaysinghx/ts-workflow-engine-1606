import axios from 'axios';

interface OtpVerifyInput {
  otp: string;
  emailId: string;
  transactionId: string;
  headers: Record<string, string>;
}

export const otpVerifyService = async ({
  otp,
  emailId,
  transactionId,
  headers,
}: OtpVerifyInput) => {
  const otpVerificationUrl = 'http://localhost:1689/v2/api/notifications/verify-otp';
  const resumeWorkflowUrl = `http://localhost:1605/api-gateway/resume-workflow/${transactionId}`;

  try {
    // 1. Verify OTP
    const { data: otpResp } = await axios.post(
      otpVerificationUrl,
      { email: emailId, otpCode: otp },
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (!otpResp?.success) {
      throw new Error(otpResp?.message || 'OTP verification failed');
    }

    // 2. Resume workflow
    const { data: workflowResp } = await axios.get(resumeWorkflowUrl, {
      headers: {
        ...headers,
        'Content-Type': headers['Content-Type'] || 'application/json',
      },
    });

    return {
      success: true,
      message: 'OTP verified and workflow resumed successfully',
      otpServiceMessage: otpResp.message,
      resumedWorkflow: workflowResp,
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
    const statusCode = isAxios ? err.response?.status ?? 500 : 500;
    const error = new Error('OTP verification and workflow resume failed');
    (error as any).transactionId = transactionId;
    (error as any).statusCode = statusCode;
    (error as any).message = message;
    throw error;
  }
};
