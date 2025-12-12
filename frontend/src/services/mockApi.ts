import { Show, Booking, BookingStatus } from '../types';

const SHOWS_KEY = 'modex_shows';
const BOOKINGS_KEY = 'modex_bookings';
const DELAY_MS = 800; // Simulate network latency

// Initialize with some dummy data if empty
const initializeData = () => {
  if (!localStorage.getItem(SHOWS_KEY)) {
    const initialShows: Show[] = [
      {
        id: '1',
        name: 'Avengers: Secret Wars',
        description: 'The epic conclusion to the multiverse saga.',
        startTime: new Date(Date.now() + 86400000).toISOString(),
        totalSeats: 40,
        price: 15,
      },
      {
        id: '2',
        name: 'Dr. Strange Appointment',
        description: 'General Consultation - 10:00 AM',
        startTime: new Date(Date.now() + 172800000).toISOString(),
        totalSeats: 1, // Doctor appointment usually 1 slot per time
        price: 100,
      },
      {
        id: '3',
        name: 'Morning Bus to City Center',
        description: 'Express Service via Highway',
        startTime: new Date(Date.now() + 3600000).toISOString(),
        totalSeats: 24,
        price: 5,
      }
    ];
    localStorage.setItem(SHOWS_KEY, JSON.stringify(initialShows));
  }
  if (!localStorage.getItem(BOOKINGS_KEY)) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
  }
};

initializeData();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  getShows: async (): Promise<Show[]> => {
    await delay(DELAY_MS);
    const data = localStorage.getItem(SHOWS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getShowById: async (id: string): Promise<Show | undefined> => {
    await delay(DELAY_MS);
    const shows = JSON.parse(localStorage.getItem(SHOWS_KEY) || '[]');
    return shows.find((s: Show) => s.id === id);
  },

  createShow: async (show: Omit<Show, 'id'>): Promise<Show> => {
    await delay(DELAY_MS);
    const shows = JSON.parse(localStorage.getItem(SHOWS_KEY) || '[]');
    const newShow: Show = { ...show, id: Math.random().toString(36).substr(2, 9) };
    shows.push(newShow);
    localStorage.setItem(SHOWS_KEY, JSON.stringify(shows));
    return newShow;
  },

  getBookingsForShow: async (showId: string): Promise<Booking[]> => {
    // Quick fetch for real-time updates without heavy delay
    const bookings: Booking[] = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    return bookings.filter((b: Booking) => b.showId === showId && b.status === BookingStatus.CONFIRMED);
  },

  createBooking: async (showId: string, seatIndices: number[]): Promise<Booking> => {
    await delay(DELAY_MS + 500); // Extra delay for "processing"

    const bookings: Booking[] = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    const shows: Show[] = JSON.parse(localStorage.getItem(SHOWS_KEY) || '[]');
    const show = shows.find(s => s.id === showId);

    if (!show) throw new Error("Show not found");

    // Concurrency Check: Check if any of the requested seats are already confirmed
    const existingBookings = bookings.filter(b => b.showId === showId && b.status === BookingStatus.CONFIRMED);
    const takenSeats = new Set(existingBookings.flatMap(b => b.seatIndices));

    const conflict = seatIndices.some(seat => takenSeats.has(seat));

    if (conflict) {
      throw new Error("One or more selected seats have already been booked by another user.");
    }

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      showId,
      userId: 'user-guest', // Mock user
      seatIndices,
      status: BookingStatus.CONFIRMED,
      timestamp: Date.now(),
    };

    bookings.push(newBooking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return newBooking;
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    await delay(DELAY_MS);
    const bookings: Booking[] = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    return bookings.filter((b: Booking) => b.userId === userId).sort((a, b) => b.timestamp - a.timestamp);
  },

  cancelBooking: async (bookingId: string): Promise<void> => {
    await delay(DELAY_MS);
    const bookings: Booking[] = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    const index = bookings.findIndex(b => b.id === bookingId);
    
    if (index === -1) throw new Error("Booking not found");
    
    // Only allow cancelling confirmed bookings
    if (bookings[index].status === BookingStatus.CONFIRMED) {
        bookings[index].status = BookingStatus.CANCELLED;
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    }
  }
};