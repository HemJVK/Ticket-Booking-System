import pool from '../config/db';
import * as showRepo from '../repositories/showRepository';
import * as bookingRepo from '../repositories/bookingRepository';

export const processBooking = async (showId: number, userId: number, seatNumber: number) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Lock the show row to serialize bookings for this show
        await showRepo.lockShowRow(client, showId);

        // Check if seat is taken
        const isTaken = await bookingRepo.checkBookingExists(client, showId, seatNumber);
        if (isTaken) {
            await client.query('ROLLBACK');
            throw new Error('Seat already booked');
        }

        // Book the seat
        const booking = await bookingRepo.insertBooking(client, showId, userId, seatNumber, 'CONFIRMED');

        await client.query('COMMIT');
        return booking;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const getBookings = async (showId: number) => {
    return await bookingRepo.fetchBookingsByShowId(showId);
};
