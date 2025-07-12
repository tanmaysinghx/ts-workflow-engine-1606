-- ************************************** Docker Environment Queries *************************************************

-- 1. User Registration with OTP- docker
INSERT INTO db1606.WorkflowConfig (
  id, workflowCode, workflowName, microserviceName, microserviceBaseUrl, downstreamEndpoint, env, apiVersion,
  redirectUrl, tokenCheck, otpFlow, notification, notificationScenarioId, retryCount,
  rollbackUrl, logResponseBody, cacheResponse, featureToggleKey, workflowGroup,
  stepSequence, createdAt, updatedAt, notificationServiceUrl, otpMicroServiceUrl
) VALUES (
  'dkr-162500001', '162500001', 'User Registration with OTP', 'auth-service', 'http://ts-auth-service-1625:1625',
  '/api/auth/register', 'docker', 'v2', 'http://ts-umt-ui-1780:1780/registration-success',
  0, 1, 1, '00001', 3, NULL, 1, 0, NULL, 'user-management',
  '["configFetch", "generateOtp", "sendOtp", "waitForOtpVerification", "callMicroservice", "sendNotification"]',
  NOW(), NOW(), 'http://ts-notification-service-1689:1689/v2/api/notifications/send', 'http://ts-notification-service-1689:1689/v2/api/notifications/send'
);

-- 2. User Login with OTP - docker
INSERT INTO db1606.WorkflowConfig (
  id, workflowCode, workflowName, microserviceName, microserviceBaseUrl, downstreamEndpoint, env, apiVersion,
  redirectUrl, tokenCheck, otpFlow, notification, notificationScenarioId, retryCount,
  rollbackUrl, logResponseBody, cacheResponse, featureToggleKey, workflowGroup,
  stepSequence, createdAt, updatedAt, notificationServiceUrl, otpMicroServiceUrl
) VALUES (
  'dkr-162500002', '162500002', 'User Login with OTP', 'auth-service', 'http://ts-auth-service-1625:1625',
  '/api/auth/login', 'docker', 'v2', '',
  0, 1, 1, '00002', 3, NULL, 1, 0, NULL, 'user-management',
  '["configFetch", "generateOtp", "sendOtp", "waitForOtpVerification", "callMicroservice", "sendNotification"]',
  NOW(), NOW(), 'http://ts-notification-service-1689:1689/v2/api/notifications/send', 'http://ts-notification-service-1689:1689/v2/api/notifications/send'
);

-- 3. User Password Change - docker
INSERT INTO db1606.WorkflowConfig (
  id, workflowCode, workflowName, microserviceName, microserviceBaseUrl, downstreamEndpoint, env, apiVersion,
  redirectUrl, tokenCheck, otpFlow, notification, notificationScenarioId, retryCount,
  rollbackUrl, logResponseBody, cacheResponse, featureToggleKey, workflowGroup,
  stepSequence, createdAt, updatedAt, notificationServiceUrl, otpMicroServiceUrl
) VALUES (
  'dkr-162500003', '162500003', 'User Password Change', 'auth-service', 'http://ts-auth-service-1625:1625',
  '/api/auth/change-password', 'docker', 'v2', '',
  0, 1, 1, '00003', 3, NULL, 1, 0, NULL, 'user-management',
  '["configFetch", "generateOtp", "sendOtp", "waitForOtpVerification", "callMicroservice", "sendNotification"]',
  NOW(), NOW(), 'http://ts-notification-service-1689:1689/v2/api/notifications/send', 'http://ts-notification-service-1689:1689/v2/api/notifications/send'
);

-- 4. Verify Auth Token - docker
INSERT INTO db1606.WorkflowConfig (
  id, workflowCode, workflowName, microserviceName, microserviceBaseUrl, downstreamEndpoint, env, apiVersion,
  redirectUrl, tokenCheck, otpFlow, notification, notificationScenarioId, retryCount,
  rollbackUrl, logResponseBody, cacheResponse, featureToggleKey, workflowGroup,
  stepSequence, createdAt, updatedAt, notificationServiceUrl, otpMicroServiceUrl
) VALUES (
  'dkr-162500004', '162500004', 'Verify Auth Token', 'auth-service', 'http://ts-auth-service-1625:1625',
  '/api/auth/verify/verify-token', 'docker', 'v2', 'http://ts-umt-ui-1780:1780/registration-success',
  0, 0, 0, '00004', 3, NULL, 1, 0, NULL, 'user-management',
  '["configFetch", "callMicroservice"]',
  NOW(), NOW(), 'http://ts-notification-service-1689:1689/v2/api/notifications/send', NULL
);

-- 5. Generate Auth Token Using Refresh Token - docker
INSERT INTO db1606.WorkflowConfig (
  id, workflowCode, workflowName, microserviceName, microserviceBaseUrl, downstreamEndpoint, env, apiVersion,
  redirectUrl, tokenCheck, otpFlow, notification, notificationScenarioId, retryCount,
  rollbackUrl, logResponseBody, cacheResponse, featureToggleKey, workflowGroup,
  stepSequence, createdAt, updatedAt, notificationServiceUrl, otpMicroServiceUrl
) VALUES (
  'dkr-162500005', '162500005', 'Generate Auth Token Using Refresh Token', 'auth-service', 'http://ts-auth-service-1625:1625',
  '/api/auth/refresh-token', 'docker', 'v2', 'http://ts-umt-ui-1780:1780/registration-success',
  0, 0, 0, '00005', 3, NULL, 1, 0, NULL, 'user-management',
  '["configFetch", "callMicroservice"]',
  NOW(), NOW(), 'http://ts-notification-service-1689:1689/v2/api/notifications/send', NULL
);




-- ************************************** Local Environment Queries *************************************************

-- 1. User Registration with OTP - local
INSERT INTO db1606.WorkflowConfig (
  id, workflowCode, workflowName, microserviceName, microserviceBaseUrl, downstreamEndpoint, env, apiVersion,
  redirectUrl, tokenCheck, otpFlow, notification, notificationScenarioId, retryCount,
  rollbackUrl, logResponseBody, cacheResponse, featureToggleKey, workflowGroup,
  stepSequence, createdAt, updatedAt, notificationServiceUrl, otpMicroServiceUrl
) VALUES (
  'local-162500001', '162500001', 'User Registration with OTP', 'auth-service', 'http://localhost:1625',
  '/api/auth/register', 'LOCAL', 'v2', 'http://localhost:4200/registration-success',
  0, 1, 1, '00001', 3, NULL, 1, 0, NULL, 'user-management',
  '["configFetch", "generateOtp", "sendOtp", "waitForOtpVerification", "callMicroservice", "sendNotification"]',
  NOW(), NOW(), 'http://localhost:1689/v2/api/notifications/send', 'http://localhost:1689/v2/api/notifications/send'
);

-- 2. User Login with OTP - local
INSERT INTO db1606.WorkflowConfig (
  id, workflowCode, workflowName, microserviceName, microserviceBaseUrl, downstreamEndpoint, env, apiVersion,
  redirectUrl, tokenCheck, otpFlow, notification, notificationScenarioId, retryCount,
  rollbackUrl, logResponseBody, cacheResponse, featureToggleKey, workflowGroup,
  stepSequence, createdAt, updatedAt, notificationServiceUrl, otpMicroServiceUrl
) VALUES (
  'local-162500002', '162500002', 'User Login with OTP', 'auth-service', 'http://localhost:1625',
  '/api/auth/login', 'LOCAL', 'v2', '',
  0, 1, 1, '00002', 3, NULL, 1, 0, NULL, 'user-management',
  '["configFetch", "generateOtp", "sendOtp", "waitForOtpVerification", "callMicroservice", "sendNotification"]',
  NOW(), NOW(), 'http://localhost:1689/v2/api/notifications/send', 'http://localhost:1689/v2/api/notifications/send'
);

-- 3. User Password Change - local
INSERT INTO db1606.WorkflowConfig (
  id, workflowCode, workflowName, microserviceName, microserviceBaseUrl, downstreamEndpoint, env, apiVersion,
  redirectUrl, tokenCheck, otpFlow, notification, notificationScenarioId, retryCount,
  rollbackUrl, logResponseBody, cacheResponse, featureToggleKey, workflowGroup,
  stepSequence, createdAt, updatedAt, notificationServiceUrl, otpMicroServiceUrl
) VALUES (
  'local-162500003', '162500003', 'User Password Change', 'auth-service', 'http://localhost:1625',
  '/api/auth/change-password', 'LOCAL', 'v2', '',
  0, 1, 1, '00003', 3, NULL, 1, 0, NULL, 'user-management',
  '["configFetch", "generateOtp", "sendOtp", "waitForOtpVerification", "callMicroservice", "sendNotification"]',
  NOW(), NOW(), 'http://localhost:1689/v2/api/notifications/send', 'http://localhost:1689/v2/api/notifications/send'
);

-- 4. Verify Auth Token - local
INSERT INTO db1606.WorkflowConfig (
  id, workflowCode, workflowName, microserviceName, microserviceBaseUrl, downstreamEndpoint, env, apiVersion,
  redirectUrl, tokenCheck, otpFlow, notification, notificationScenarioId, retryCount,
  rollbackUrl, logResponseBody, cacheResponse, featureToggleKey, workflowGroup,
  stepSequence, createdAt, updatedAt, notificationServiceUrl, otpMicroServiceUrl
) VALUES (
  'local-162500004', '162500004', 'Verify Auth Token', 'auth-service', 'http://localhost:1625',
  '/api/auth/verify/verify-token', 'LOCAL', 'v2', 'http://localhost:4200/registration-success',
  0, 0, 0, '00004', 3, NULL, 1, 0, NULL, 'user-management',
  '["configFetch", "callMicroservice"]',
  NOW(), NOW(), 'http://localhost:1689/v2/api/notifications/send', NULL
);

-- 5. Generate Auth Token Using Refresh Token - local
INSERT INTO db1606.WorkflowConfig (
  id, workflowCode, workflowName, microserviceName, microserviceBaseUrl, downstreamEndpoint, env, apiVersion,
  redirectUrl, tokenCheck, otpFlow, notification, notificationScenarioId, retryCount,
  rollbackUrl, logResponseBody, cacheResponse, featureToggleKey, workflowGroup,
  stepSequence, createdAt, updatedAt, notificationServiceUrl, otpMicroServiceUrl
) VALUES (
  'local-162500005', '162500005', 'Generate Auth Token Using Refresh Token', 'auth-service', 'http://localhost:1625',
  '/api/auth/refresh-token', 'LOCAL', 'v2', 'http://localhost:4200/registration-success',
  0, 0, 0, '00005', 3, NULL, 1, 0, NULL, 'user-management',
  '["configFetch", "callMicroservice"]',
  NOW(), NOW(), 'http://localhost:1689/v2/api/notifications/send', NULL
);
