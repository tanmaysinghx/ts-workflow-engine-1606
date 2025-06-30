import { Router } from 'express';
import { handleWorkflowRequest } from '../controllers/workflowController';

const router = Router();

// Example: /workflow-engine/v2/QA/162500001
router.post('/workflow-engine/:version/:env/:workflowCode', handleWorkflowRequest);

export default router;
