import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Show, Booking } from '../types';
import { useTicket } from '../context/TicketContext';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId } = useTicket(); // Consume from context
  const [show, setShow] = useState<Show | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  // Removed local userId state
  const seatContainerRef = useRef<HTMLDivElement>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const showRes = await axios.get(`http://localhost:3000/api/shows/${id}`);
        setShow(showRes.data);
        const bookingRes = await axios.get(`http://localhost:3000/api/bookings/show/${id}`);
        setBookings(bookingRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Direct DOM Manipulation as requested
  // This effect updates the seat visuals directly on the DOM
  useEffect(() => {
    if (!seatContainerRef.current || !show) return;

    // Clear previous children
    seatContainerRef.current.innerHTML = '';

    for (let i = 1; i <= show.total_seats; i++) {
      const seatEl = document.createElement('div');
      seatEl.textContent = i.toString();
      seatEl.className =
        'w-10 h-10 flex items-center justify-center border rounded cursor-pointer transition select-none';

      const isBooked = bookings.some((b) => b.seat_number === i && b.status === 'CONFIRMED');

      if (isBooked) {
        seatEl.classList.add('bg-red-300', 'cursor-not-allowed', 'text-white');
        seatEl.onclick = null;
      } else {
        // Check if selected by current user (in React state)
        if (selectedSeats.includes(i)) {
             seatEl.classList.add('bg-green-500', 'text-white');
        } else {
             seatEl.classList.add('bg-gray-100', 'hover:bg-green-200');
        }

        // Direct DOM event listener
        seatEl.onclick = () => {
           handleSeatClick(i, seatEl);
        };
      }
      seatContainerRef.current.appendChild(seatEl);
    }
  }, [show, bookings, selectedSeats]);

  const handleSeatClick = (seatNum: number, el: HTMLElement) => {
      // Toggle selection state
      // We need to update React state to trigger re-renders or API calls logic
      // But we can also manipulate DOM classes here immediately for feedback

      if (el.classList.contains('bg-green-500')) {
          // Deselect
          el.classList.remove('bg-green-500', 'text-white');
          el.classList.add('bg-gray-100', 'hover:bg-green-200');
          setSelectedSeats(prev => prev.filter(s => s !== seatNum));
      } else {
          // Select
          el.classList.remove('bg-gray-100', 'hover:bg-green-200');
          el.classList.add('bg-green-500', 'text-white');
          setSelectedSeats(prev => [...prev, seatNum]);
      }
  };


  const handleBooking = async () => {
      if (selectedSeats.length === 0) return;

      // Process bookings sequentially or in parallel?
      // Requirement: "Book one or more seats".
      // We'll try to book all selected.

      const results = [];
      for (const seat of selectedSeats) {
          try {
              await axios.post('http://localhost:3000/api/bookings', {
                  show_id: show?.id,
                  user_id: userId,
                  seat_number: seat
              });
              results.push({ seat, status: 'Success' });
          } catch (error) {
              results.push({ seat, status: 'Failed' });
          }
      }

      alert(`Booking Results:\n${results.map(r => `Seat ${r.seat}: ${r.status}`).join('\n')}`);

      // Refresh data
      window.location.reload();
  };

  if (loading) return <div>Loading...</div>;
  if (!show) return <div>Show not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{show.name}</h1>
      <p className="text-gray-600 mb-6">{new Date(show.start_time).toLocaleString()}</p>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Select Seats</h2>
        <div
            ref={seatContainerRef}
            className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-w-2xl"
        >
            {/* DOM nodes injected here */}
        </div>
      </div>

      <div className="mt-6">
          <p className="mb-2">Selected Seats: {selectedSeats.join(', ')}</p>
          <button
            onClick={handleBooking}
            disabled={selectedSeats.length === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
              Confirm Booking
          </button>
      </div>
    </div>
  );
};

export default BookingPage;
