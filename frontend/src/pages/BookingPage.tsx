import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Show, Booking } from '../types';
import { useTicket } from '../context/TicketContext';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); // Consume from AuthContext
  const [show, setShow] = useState<Show | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const seatContainerRef = useRef<HTMLDivElement>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  // New State for Seat Count Selection
  const [requiredSeats, setRequiredSeats] = useState<number>(0);
  const [isSeatCountSet, setIsSeatCountSet] = useState(false);

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


  const handleSeatClick = (seatNum: number, el: HTMLElement) => {
      if (el.classList.contains('bg-green-500')) {
          // Deselect
          el.classList.remove('bg-green-500', 'text-white');
          el.classList.add('bg-gray-100', 'hover:bg-green-200');
          setSelectedSeats(prev => prev.filter(s => s !== seatNum));
      } else {
          // Select - Check limit
          if (selectedSeats.length >= requiredSeats) {
              alert(`You can only select ${requiredSeats} seats.`);
              return;
          }
          el.classList.remove('bg-gray-100', 'hover:bg-green-200');
          el.classList.add('bg-green-500', 'text-white');
          setSelectedSeats(prev => [...prev, seatNum]);
      }
  };

  const handleBooking = async () => {
      if (!user) {
          navigate('/login');
          return;
      }
      if (selectedSeats.length !== requiredSeats) return;

      // We process the first seat to create the "Group Booking" ID or just book them all.
      // For simplicity, we treat the FIRST successful booking as the main reference for payment.
      // Or we can group them. The payment flow expects a single bookingId.
      // So let's modify backend to support group booking? Or just pick one ID.
      // I'll pick the first one.

      let primaryBookingId = null;
      let amount = 0;
      const pricePerSeat = 10;

      for (const seat of selectedSeats) {
          try {
              const res = await axios.post('http://localhost:3000/api/bookings', {
                  show_id: show?.id,
                  user_id: user.id,
                  seat_number: seat
              });
              if (!primaryBookingId) primaryBookingId = res.data.id;
              amount += pricePerSeat;
          } catch (error) {
              alert(`Seat ${seat} could not be booked. Please try another.`);
              window.location.reload(); // Hard reset on failure
              return;
          }
      }

      // Redirect to Payment
      if (primaryBookingId) {
          navigate(`/payment/${primaryBookingId}`, { state: { amount } });
      }
  };

  if (loading) return <div>Loading...</div>;
  if (!show) return <div>Show not found</div>;

  if (!isSeatCountSet) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="bg-white p-8 rounded shadow text-center">
                  <h2 className="text-xl font-bold mb-4">How many seats?</h2>
                  <div className="flex gap-2 justify-center mb-6">
                      {[1, 2, 3, 4, 5, 6].map(num => (
                          <button
                            key={num}
                            onClick={() => { setRequiredSeats(num); setIsSeatCountSet(true); }}
                            className="w-10 h-10 rounded-full border hover:bg-red-600 hover:text-white transition"
                          >
                              {num}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="p-4 container mx-auto">
      <h1 className="text-2xl font-bold mb-2">{show.name}</h1>
      <p className="text-gray-600 mb-6">{new Date(show.start_time).toLocaleString()}</p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
            <h2 className="text-lg font-semibold mb-4">Select {requiredSeats} Seats</h2>
            <div className="mb-4 p-4 bg-gray-200 rounded text-center text-sm">SCREEN</div>
            <div
                ref={seatContainerRef}
                className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-w-2xl mx-auto"
            >
                {/* DOM nodes injected here */}
            </div>

            <div className="mt-4 flex gap-4 text-sm justify-center">
                <span className="flex items-center"><div className="w-4 h-4 bg-gray-100 border mr-1"></div> Available</span>
                <span className="flex items-center"><div className="w-4 h-4 bg-green-500 mr-1"></div> Selected</span>
                <span className="flex items-center"><div className="w-4 h-4 bg-red-300 mr-1"></div> Booked</span>
            </div>
        </div>

        <div className="w-full lg:w-1/3">
             <div className="bg-white p-6 rounded shadow border">
                 <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
                 <div className="space-y-2 mb-4">
                     <div className="flex justify-between">
                         <span>Movie</span>
                         <span className="font-semibold">{show.name}</span>
                     </div>
                     <div className="flex justify-between">
                         <span>Seats</span>
                         <span className="font-semibold">{requiredSeats}</span>
                     </div>
                     <div className="flex justify-between">
                         <span>Selected</span>
                         <span className="font-semibold">{selectedSeats.join(', ')}</span>
                     </div>
                     <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                         <span>Total</span>
                         <span>${requiredSeats * 10}</span>
                     </div>
                 </div>

                 <button
                    onClick={handleBooking}
                    disabled={selectedSeats.length !== requiredSeats}
                    className="w-full bg-red-600 text-white py-3 rounded font-bold disabled:opacity-50 hover:bg-red-700"
                  >
                      Proceed to Payment
                  </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
