import { v4 as uuidv4 } from 'uuid';
import axios, { AxiosError } from 'axios';
import prisma from '../config/db';

interface WorkflowInput {
    version: string;
    env: string;
    workflowCode: string;
    body: any;
    headers: any;
}

export const processWorkflow = async ({
    version,
    env,
    workflowCode,
    body,
    headers,
}: WorkflowInput) => {
    const transactionId = uuidv4();
    const startTime = new Date();
    const stepsFollowed: string[] = [];

    try {
        // ✅ Step 1: Fetch Config
        const config = await findApiConfig({
            version,
            env,
            workflowCode,
            transactionId,
            stepsFollowed,
        });

        // 🔐 Step 2: Token Verification
        if (config.tokenCheck) {
            await processVerifyToken({
                config,
                body,
                headers,
                transactionId,
                stepsFollowed,
                env,
                version,
                startTime,
            });
        }

        // 📡 Step 3: Downstream call
        const downstreamResp = await handleDownstreamCall({
            config,
            body,
            headers,
            transactionId,
            stepsFollowed,
            env,
            version,
            startTime,
        });

        // 🟢 Final Logging
        await logWorkflowTransaction({
            transactionId,
            config,
            body,
            headers,
            env,
            version,
            startTime,
            stepsFollowed,
            success: true,
            successDescription: 'All steps completed including downstream call',
        });

        return {
            success: true,
            transactionId,
            message: 'Workflow executed successfully',
            configSummary: {
                microservice: config.microserviceName,
                url: config.microserviceBaseUrl + config.downstreamEndpoint,
                tokenCheck: config.tokenCheck,
                otpFlow: config.otpFlow,
                notification: config.notification,
            },
            data: {
                downstreamResponse: downstreamResp,
            },
            errors: null,
            meta: {
                timestamp: new Date().toISOString(),
                apiVersion: version,
            },
        };
    } catch (err: any) {
        return {
            success: false,
            transactionId,
            message: 'Workflow processing failed',
            data: null,
            errors: err?.errors ?? {
                general: err.message ?? 'Unexpected error',
            },
            meta: {
                timestamp: new Date().toISOString(),
                apiVersion: version,
            },
        };
    }
};


export const findApiConfig = async ({
    version,
    env,
    workflowCode,
    transactionId,
    stepsFollowed
}: {
    version: string;
    env: string;
    workflowCode: string;
    transactionId: string;
    stepsFollowed: string[];
}) => {
    const config = await prisma.workflowConfig.findFirst({
        where: {
            workflowCode,
            env,
            apiVersion: version,
        },
    });

    if (!config) {
        const error = new Error(`Workflow config not found for ${workflowCode} in ${env} (${version})`);
        (error as any).transactionId = transactionId;
        (error as any).errors = {
            config: 'Workflow configuration missing',
        };
        throw error;
    }

    stepsFollowed.push('configFetch');

    return config;
};

export const logWorkflowTransaction = async ({
    transactionId,
    config,
    body,
    headers,
    env,
    version,
    startTime,
    stepsFollowed,
    success,
    successDescription,
}: {
    transactionId: string;
    config: any;
    body: any;
    headers: any;
    env: string;
    version: string;
    startTime: Date;
    stepsFollowed: string[];
    success: boolean;
    successDescription?: string;
}) => {
    await prisma.workflowTransaction.create({
        data: {
            transactionId,
            workflowConfigId: config.id,
            workflowCode: config.workflowCode,
            env,
            apiVersion: version,
            requestPayload: body,
            origin: headers['x-origin'] ?? '',
            traceHeaders: headers,
            success: success,
            successDescription: successDescription ?? 'Workflow executed successfully',
            timestampStart: startTime,
            timestampEnd: new Date(),
            stepsFollowed,
            redirectUrl: config.redirectUrl,
        },
    });
}

export const processVerifyToken = async ({
    config,
    body,
    headers,
    transactionId,
    stepsFollowed,
    env,
    version,
    startTime,
}: {
    config: any;
    body: any;
    headers: any;
    transactionId: string;
    stepsFollowed: string[];
    env: string;
    version: string;
    startTime: Date;
}) => {
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
        const error = new Error('Missing Authorization header for tokenCheck');
        (error as any).transactionId = transactionId;
        (error as any).errors = { auth: 'Authorization token is missing' };
        throw error;
    }

    try {
        const tokenVerificationUrl = `${config.microserviceBaseUrl}/${config.apiVersion}/api/auth/verify/verify-token`;

        const verifyResp = await axios.post(
            tokenVerificationUrl,
            { token },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!verifyResp.data?.success) {
            throw new Error(verifyResp.data?.message ?? 'Token verification failed');
        }

        stepsFollowed.push('tokenCheck');
        return stepsFollowed;
    } catch (err: unknown) {
        const isAxios = axios.isAxiosError(err);
        const axiosError = err as AxiosError;
        const errorMessage =
            isAxios && (axiosError.response?.data as { message?: string })?.message
                ? (axiosError.response?.data as { message?: string }).message
                : 'Token verification failed';

        await prisma.workflowTransaction.create({
            data: {
                transactionId,
                workflowConfigId: config.id,
                workflowCode: config.workflowCode,
                env,
                apiVersion: version,
                requestPayload: body,
                origin: headers['x-origin'] ?? '',
                traceHeaders: headers,
                success: false,
                errorDescription: errorMessage,
                timestampStart: startTime,
                timestampEnd: new Date(),
                stepsFollowed,
                redirectUrl: config.redirectUrl,
            },
        });

        const error = new Error('Token verification failed');
        (error as any).transactionId = transactionId;
        (error as any).errors = {
            auth: errorMessage,
            statusCode: (axiosError.response?.status ?? 403),
        };
        (error as any).originalError = err;
        throw error;
    }
};

export const handleDownstreamCall = async ({
    config,
    body,
    headers,
    transactionId,
    stepsFollowed,
    env,
    version,
    startTime,
}: {
    config: any;
    body: any;
    headers: any;
    transactionId: string;
    stepsFollowed: string[];
    env: string;
    version: string;
    startTime: Date;
}) => {
    try {
        const downstreamUrl = `${config.microserviceBaseUrl}/${config.apiVersion}${config.downstreamEndpoint}`;
        const downstreamResp = await axios.post(downstreamUrl, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        stepsFollowed.push('downstreamCall');

        return {
            statusCode: downstreamResp.status,
            microserviceResponse: downstreamResp.data,
            errors: null,
        };
    } catch (err) {
        let errorMessage = 'Downstream service error';
        let statusCode = 500;
        let errorData: any = null;

        if (axios.isAxiosError(err)) {
            statusCode = err.response?.status ?? 500;
            errorData = err.response?.data;

            if (errorData?.message) {
                errorMessage = errorData.message;
            } else if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData?.error) {
                errorMessage = errorData.error;
            }
        }

        const error = new Error('Workflow downstream call failed');
        (error as any).transactionId = transactionId;
        (error as any).errors = {
            downstream: errorMessage,
            statusCode,
            rawResponse: errorData,
        };
        (error as any).originalError = err;

        throw error;
    }
};;

