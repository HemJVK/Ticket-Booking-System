export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface Show {
  id: string;
  name: string;
  description?: string;
  startTime: string; // ISO string
  totalSeats: number;
  price: number;
}

export interface Booking {
  id: string;
  showId: string;
  userId: string; // simpler than full user object for this demo
  seatIndices: number[];
  status: BookingStatus;
  timestamp: number;
}

export interface SeatState {
  index: number;
  isBooked: boolean;
  isSelected: boolean;
}

export interface ApiError {
  message: string;
}

export type Role = 'ADMIN' | 'USER';