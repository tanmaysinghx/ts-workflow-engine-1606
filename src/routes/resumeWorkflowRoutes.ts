import { Router } from 'express';
import { resumeWorkflowController } from '../controllers/resumeWorkflowController';

const router = Router();

router.get('/:transactionId', resumeWorkflowController);

export default router;