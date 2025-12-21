import { Request, Response } from 'express';
import * as bookingService from '../services/bookingService';

export const bookSeat = async (req: Request, res: Response) => {
  const { show_id, seat_number, user_id } = req.body;

  try {
    const booking = await bookingService.processBooking(show_id, user_id, seat_number);
    res.status(201).json(booking);
  } catch (error: any) {
    if (error.message === 'Seat already booked') {
        res.status(409).json({ message: 'Seat already booked' });
    } else {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const getBookingsForShow = async (req: Request, res: Response) => {
  const { showId } = req.params;
  try {
    const bookings = await bookingService.getBookings(Number(showId));
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
