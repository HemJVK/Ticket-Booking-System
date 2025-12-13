import { Request, Response } from 'express';
import * as paymentService from '../services/paymentService';

export const payBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId, amount, paymentMethod } = req.body;
        if (paymentMethod !== 'GOOGLE_PAY') {
             return res.status(400).json({ error: 'Only Google Pay is supported' });
        }

        const result = await paymentService.processGPayPayment(bookingId, amount, 'mock_gpay_token');
        res.json(result);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Payment failed' });
    }
};

export const verifyTicket = async (req: Request, res: Response) => {
    try {
        const { code } = req.body; // or req.params
        const ticket = await paymentService.verifyTicket(code);
        if (!ticket) {
            return res.status(404).json({ valid: false, message: 'Invalid Ticket' });
        }
        res.json({ valid: true, ticket });
    } catch (error) {
        res.status(500).json({ error: 'Verification failed' });
    }
};
