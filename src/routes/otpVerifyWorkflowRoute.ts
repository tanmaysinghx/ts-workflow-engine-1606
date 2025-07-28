import { Router } from "express";
import { otpVerifyController } from "../controllers/otpVerifyWorkflowController";

const router = Router();

router.post('/:otp/:emailId/:transactionId', otpVerifyController);

export default router;