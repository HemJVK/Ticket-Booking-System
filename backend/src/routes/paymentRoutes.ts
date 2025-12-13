import { Router } from 'express';
import { payBooking, verifyTicket } from '../controllers/paymentController';

const router = Router();

router.post('/pay', payBooking);
router.post('/verify', verifyTicket);

export default router;
