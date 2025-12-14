import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Show, Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Armchair, ChevronRight } from 'lucide-react';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [show, setShow] = useState<Show | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const seatContainerRef = useRef<HTMLDivElement>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
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

  const isBooked = (seatNum: number) => bookings.some(b => b.seat_number === seatNum && b.status === 'CONFIRMED');
  const isSelected = (seatNum: number) => selectedSeats.includes(seatNum);

  const handleSeatClick = (seatNum: number) => {
      if (isBooked(seatNum)) return;

      if (isSelected(seatNum)) {
          setSelectedSeats(prev => prev.filter(s => s !== seatNum));
      } else {
          if (selectedSeats.length >= requiredSeats) {
              return;
          }
          setSelectedSeats(prev => [...prev, seatNum]);
      }
  };

  const handleBooking = async () => {
      if (!user) {
          navigate('/login');
          return;
      }
      if (selectedSeats.length !== requiredSeats) return;

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
              alert(`Seat ${seat} could not be booked.`);
              window.location.reload();
              return;
          }
      }

      if (primaryBookingId) {
          navigate(`/payment/${primaryBookingId}`, { state: { amount } });
      }
  };

  if (loading) return <div className="min-h-screen bg-cinema-900 text-white flex justify-center items-center">Loading...</div>;
  if (!show) return <div className="min-h-screen bg-cinema-900 text-white flex justify-center items-center">Show not found</div>;

  // Seat Count Selection Screen
  if (!isSeatCountSet) {
      return (
          <div className="min-h-screen bg-cinema-900 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-cinema-800 p-8 rounded-2xl shadow-2xl border border-white/10 text-center max-w-md w-full"
              >
                  <h2 className="text-2xl font-bold mb-2 text-white">How many seats?</h2>
                  <p className="text-gray-400 mb-8">Select the number of tickets you want to book</p>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                      {[1, 2, 3, 4, 5, 6].map(num => (
                          <motion.button
                            key={num}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setRequiredSeats(num); setIsSeatCountSet(true); }}
                            className="bg-cinema-900 border border-white/10 hover:border-cinema-red hover:bg-cinema-red text-white py-4 rounded-xl text-xl font-bold transition-colors"
                          >
                              {num}
                          </motion.button>
                      ))}
                  </div>

                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </motion.div>
          </div>
      );
  }

  // Booking Screen
  return (
    <div className="bg-cinema-900 min-h-screen text-white p-4 pb-20">
      <div className="container mx-auto max-w-5xl">
          <div className="mb-8 flex justify-between items-end border-b border-white/10 pb-4">
              <div>
                  <h1 className="text-3xl font-bold text-white mb-1">{show.name}</h1>
                  <p className="text-gray-400">{new Date(show.start_time).toLocaleString()}</p>
              </div>
              <div className="text-right">
                  <p className="text-sm text-gray-400">Tickets</p>
                  <p className="text-2xl font-bold text-cinema-red">{requiredSeats}</p>
              </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Screen & Seats */}
            <div className="flex-1">
                {/* Screen Visual */}
                <div className="mb-10 relative perspective-[1000px]">
                     <div className="h-16 bg-white/10 rounded-t-[50%] shadow-[0_10px_30px_rgba(255,255,255,0.1)] w-3/4 mx-auto screen-perspective transform origin-bottom"></div>
                     <p className="text-center text-gray-500 text-sm mt-4 tracking-[0.5em] uppercase">Screen</p>
                </div>

                {/* Seat Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 max-w-2xl mx-auto px-4">
                    {Array.from({ length: show.total_seats }, (_, i) => i + 1).map(seatNum => {
                        const booked = isBooked(seatNum);
                        const selected = isSelected(seatNum);

                        return (
                            <motion.button
                                key={seatNum}
                                whileHover={!booked ? { scale: 1.1 } : {}}
                                whileTap={!booked ? { scale: 0.9 } : {}}
                                onClick={() => handleSeatClick(seatNum)}
                                disabled={booked}
                                className={`
                                    relative flex items-center justify-center p-2 rounded-lg transition-colors duration-300
                                    ${booked ? 'text-gray-700 cursor-not-allowed' :
                                      selected ? 'text-cinema-red drop-shadow-[0_0_8px_rgba(229,9,20,0.6)]' :
                                      'text-gray-500 hover:text-white'}
                                `}
                            >
                                <Armchair size={32} fill={selected || booked ? 'currentColor' : 'none'} strokeWidth={1.5} />
                                <span className="absolute text-[10px] font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference">
                                    {seatNum}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="mt-12 flex justify-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2"><Armchair size={20} className="text-gray-500" /> Available</div>
                    <div className="flex items-center gap-2"><Armchair size={20} className="text-cinema-red" fill="currentColor" /> Selected</div>
                    <div className="flex items-center gap-2"><Armchair size={20} className="text-gray-700" fill="currentColor" /> Booked</div>
                </div>
            </div>

            {/* Summary Card */}
            <div className="w-full lg:w-80 shrink-0">
                 <div className="bg-cinema-800 p-6 rounded-xl border border-white/10 sticky top-24 shadow-2xl">
                     <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Booking Summary</h3>

                     <div className="space-y-4 mb-6 text-sm">
                         <div className="flex justify-between">
                             <span className="text-gray-400">Seat(s)</span>
                             <span className="font-bold text-white">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</span>
                         </div>
                         <div className="flex justify-between">
                             <span className="text-gray-400">Price</span>
                             <span className="font-bold text-white">$10.00 x {requiredSeats}</span>
                         </div>
                         <div className="flex justify-between">
                             <span className="text-gray-400">Fee</span>
                             <span className="font-bold text-white">$2.00</span>
                         </div>
                         <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-bold text-cinema-gold">
                             <span>Total</span>
                             <span>${requiredSeats * 10 + 2}</span>
                         </div>
                     </div>

                     <button
                        onClick={handleBooking}
                        disabled={selectedSeats.length !== requiredSeats}
                        className="w-full bg-cinema-red text-white py-4 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition flex items-center justify-center gap-2"
                      >
                          Proceed to Payment <ChevronRight size={18} />
                      </button>
                 </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default BookingPage;
