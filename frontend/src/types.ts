export interface Show {
  id: number;
  name: string;
  start_time: string;
  total_seats: number;
}

export interface Booking {
  id: number;
  show_id: number;
  user_id: number;
  seat_number: number;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  created_at: string;
}
