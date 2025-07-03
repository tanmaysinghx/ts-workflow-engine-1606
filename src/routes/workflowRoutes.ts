import { Router } from 'express';
import { handleWorkflowRequest } from '../controllers/workflowController';
import { resumeWorkflowController } from '../controllers/resumeWorkflowController';

const router = Router();

router.post('/workflow-engine/:version/:env/:workflowCode', handleWorkflowRequest);
router.get('/workflow-engine-resume/:transactionId', resumeWorkflowController);

export default router;
