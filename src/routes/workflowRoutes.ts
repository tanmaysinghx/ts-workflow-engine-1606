import { Router } from 'express';
import { handleWorkflowRequest } from '../controllers/workflowController';

const router = Router();

router.post('/:version/:env/:workflowCode', handleWorkflowRequest);

export default router;
