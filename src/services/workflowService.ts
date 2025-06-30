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

    //await verifyOtp(...);
    //const downstreamResponse = await callMicroservice(...); // Only this sets success

    // 🔐 Token Verification
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

    // ✅ Successful Transaction Logging
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
            success: true,
            successDescription: 'Workflow config fetched and token validated (if required)',
            timestampStart: startTime,
            timestampEnd: new Date(),
            stepsFollowed,
            redirectUrl: config.redirectUrl,
        },
    });

    return {
        success: true,
        transactionId,
        message: 'Workflow config fetched and token verified (if required)',
        data: {
            configSummary: {
                microservice: config.microserviceName,
                url: config.microserviceBaseUrl + config.downstreamEndpoint,
                tokenCheck: config.tokenCheck,
                otpFlow: config.otpFlow,
                notification: config.notification,
            },
            data: {
                downstreamResponse: null
            },
        },
        errors: null,
        meta: {
            timestamp: new Date().toISOString(),
            apiVersion: version,
        },
    };
};

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
