import pool from '../config/db';

export const checkBookingExists = async (client: any, showId: number, seatNumber: number) => {
    const result = await client.query(
      'SELECT * FROM bookings WHERE show_id = $1 AND seat_number = $2',
      [showId, seatNumber]
    );
    return result.rows.length > 0;
};

export const insertBooking = async (client: any, showId: number, userId: number, seatNumber: number, status: string) => {
    const result = await client.query(
      'INSERT INTO bookings (show_id, user_id, seat_number, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [showId, userId, seatNumber, status]
    );
    return result.rows[0];
};

export const fetchBookingsByShowId = async (showId: number) => {
    const result = await pool.query('SELECT * FROM bookings WHERE show_id = $1', [showId]);
    return result.rows;
};
