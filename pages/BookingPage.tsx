import React, { useEffect, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { SeatGrid } from '../components/SeatGrid';
import { Button } from '../components/ui/Button';
import { mockApi } from '../services/mockApi';
import { BookingStatus } from '../types';

interface BookingPageProps {
  showId: string;
  onBack: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ showId, onBack }) => {
  const { shows, addNotification } = useApp();
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const show = shows.find(s => s.id === showId);

  const fetchBookedSeats = useCallback(async () => {
    try {
      const bookings = await mockApi.getBookingsForShow(showId);
      const taken = bookings
        .filter(b => b.status === BookingStatus.CONFIRMED)
        .flatMap(b => b.seatIndices);
      setBookedSeats(taken);
    } catch (error) {
      console.error("Failed to fetch seat availability", error);
    } finally {
      setIsLoadingData(false);
    }
  }, [showId]);

  // Initial fetch
  useEffect(() => {
    fetchBookedSeats();
    // Bonus: Polling for live updates (simulating concurrency)
    const interval = setInterval(fetchBookedSeats, 3000);
    return () => clearInterval(interval);
  }, [fetchBookedSeats]);

  const handleToggleSeat = (seatNum: number) => {
    setSelectedSeats(prev => 
      prev.includes(seatNum) 
        ? prev.filter(s => s !== seatNum) 
        : [...prev, seatNum]
    );
  };

  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) return;

    setIsProcessing(true);
    try {
      await mockApi.createBooking(showId, selectedSeats);
      addNotification(`Booking Confirmed! Seats: ${selectedSeats.join(', ')}`, 'success');
      setSelectedSeats([]);
      fetchBookedSeats(); // Update visuals immediately
    } catch (error: any) {
      addNotification(error.message || "Booking Failed. Please try again.", 'error');
      // Refresh to show which seats were actually taken
      fetchBookedSeats();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!show) return <div className="p-8 text-center">Show not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button onClick={onBack} variant="outline" className="mb-4">
        ← Back to Events
      </Button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="border-b border-slate-100 pb-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{show.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
             <span className="bg-slate-100 px-3 py-1 rounded-full">{new Date(show.startTime).toLocaleString()}</span>
             <span className="bg-slate-100 px-3 py-1 rounded-full">${show.price} / seat</span>
          </div>
        </div>

        {isLoadingData ? (
           <div className="flex justify-center py-20">
             <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : (
          <>
            <SeatGrid
              totalSeats={show.totalSeats}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
              onToggleSeat={handleToggleSeat}
            />

            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Selected Seats</p>
                <p className="text-lg font-bold text-slate-900 min-h-[1.75rem]">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                </p>
              </div>
              <div className="text-right">
                 <p className="text-sm text-slate-500">Total Price</p>
                 <p className="text-2xl font-bold text-indigo-600">
                    ${selectedSeats.length * show.price}
                 </p>
              </div>
              <Button 
                onClick={handleConfirmBooking} 
                disabled={selectedSeats.length === 0} 
                isLoading={isProcessing}
                className="w-full sm:w-auto px-8"
              >
                Confirm Booking
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};