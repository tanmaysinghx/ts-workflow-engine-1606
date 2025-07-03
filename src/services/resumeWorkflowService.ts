import redis from '../config/redis';
import { handleDownstreamCall } from './workflowService';

export const resumeWorkflow = async (resumeId: string) => {
    const redisKey = `workflow:${resumeId}`;
    const cachedData = await redis.get(redisKey);

    if (!cachedData) {
        throw new Error('Workflow resumeId not found or expired.');
    }

    const {
        config,
        version,
        env,
        startTime,
        stepsFollowed,
        transactionId,
        body,
        headers
    } = JSON.parse(cachedData);

    // ⚙️ Add the otpVerified step manually
    stepsFollowed.push('otpVerified');

    // 📡 Continue with downstream service call
    const downstreamResp = await handleDownstreamCall({
        config,
        body,
        headers,
        transactionId,
        stepsFollowed,
        env,
        version,
        startTime
    });

    // 🧹 Optional: Delete redis key after resuming
    await redis.del(redisKey);

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
};
