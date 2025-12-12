import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockApi } from '../services/mockApi';
import { Booking, BookingStatus } from '../types';
import { Button } from '../components/ui/Button';

export const MyBookings: React.FC = () => {
  const { shows, addNotification } = useApp();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      // Hardcoded user ID for this demo as per mockApi defaults
      const data = await mockApi.getUserBookings('user-guest');
      setBookings(data);
    } catch (error) {
      addNotification("Failed to load your bookings", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    setProcessingId(bookingId);
    try {
      await mockApi.cancelBooking(bookingId);
      addNotification("Booking cancelled successfully", 'success');
      // Refresh list
      const data = await mockApi.getUserBookings('user-guest');
      setBookings(data);
    } catch (error) {
      addNotification("Failed to cancel booking", 'error');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500">You haven't booked any events yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const show = shows.find(s => s.id === booking.showId);
            const isCancelled = booking.status === BookingStatus.CANCELLED;
            
            return (
              <div 
                key={booking.id} 
                className={`bg-white rounded-lg shadow-sm border p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors ${isCancelled ? 'border-slate-200 bg-slate-50 opacity-75' : 'border-indigo-100'}`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`font-bold text-lg ${isCancelled ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                      {show?.name || 'Unknown Event'}
                    </h3>
                    {isCancelled && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-slate-200 text-slate-600 rounded">CANCELLED</span>
                    )}
                    {!isCancelled && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded">CONFIRMED</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm mb-2">
                    {show ? new Date(show.startTime).toLocaleString() : 'Date unknown'}
                  </p>
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">Seats:</span> {booking.seatIndices.join(', ')}
                  </p>
                </div>

                {!isCancelled && (
                  <Button 
                    variant="danger" 
                    onClick={() => handleCancel(booking.id)}
                    isLoading={processingId === booking.id}
                    className="text-xs sm:text-sm px-3 py-1.5"
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};