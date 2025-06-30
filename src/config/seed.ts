import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.workflowConfig.upsert({
        where: { workflowCode: '162500001' },
        update: {}, // No update for now
        create: {
            workflowCode: '162500001',
            workflowName: 'User Registration with OTP',
            microserviceName: 'auth-service',
            microserviceBaseUrl: 'http://localhost:1625',
            downstreamEndpoint: '/api/auth/register',
            env: 'QA',
            apiVersion: 'v2',
            redirectUrl: 'http://localhost:4200/registration-success', // frontend success route

            // Step-based controls
            tokenCheck: true,
            otpFlow: true,
            notification: true,
            notificationScenarioId: '00003',

            // Future support
            retryCount: 3,
            rollbackUrl: null,
            authLevel: 'NONE',
            logResponseBody: true,
            cacheResponse: false,
            featureToggleKey: null,
            workflowGroup: 'user-management',
            schemaValidatorId: null,

            // Define step order for orchestration
            stepSequence: [
                'configFetch',
                'tokenCheck',
                'generateOtp',
                'sendOtp',
                'waitForOtpVerification',
                'callMicroservice',
                'sendNotification'
            ],
        },
    });

    console.log('🌱 Seeded workflow config for register endpoint.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
