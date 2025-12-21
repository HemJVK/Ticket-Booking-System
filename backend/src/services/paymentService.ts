import pool from '../config/db';
import * as bookingRepo from '../repositories/bookingRepository';

// Mock GPay Service
export const processGPayPayment = async (bookingId: number, amount: number, paymentMethodId: string) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate success (always success for mock)
    // Update booking status
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Update payment status
        await client.query(
            "UPDATE bookings SET payment_status = 'PAID', status = 'CONFIRMED' WHERE id = $1",
            [bookingId]
        );

        // Generate Ticket Code (Simple UUID or random string)
        const ticketCode = `TICKET-${bookingId}-${Math.floor(Math.random() * 100000)}`;
        await client.query(
            "UPDATE bookings SET ticket_code = $1 WHERE id = $2",
            [ticketCode, bookingId]
        );

        await client.query('COMMIT');
        return { success: true, ticketCode };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

export const verifyTicket = async (ticketCode: string) => {
    const res = await pool.query(
        "SELECT b.*, s.name as show_name, s.start_time FROM bookings b JOIN shows s ON b.show_id = s.id WHERE ticket_code = $1",
        [ticketCode]
    );
    if (res.rows.length === 0) return null;
    return res.rows[0];
};
