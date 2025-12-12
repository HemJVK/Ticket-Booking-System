import React from 'react';
import { cn } from '../utils/cn';

interface SeatGridProps {
  totalSeats: number;
  bookedSeats: number[];
  selectedSeats: number[];
  onToggleSeat: (index: number) => void;
}

export const SeatGrid: React.FC<SeatGridProps> = ({
  totalSeats,
  bookedSeats,
  selectedSeats,
  onToggleSeat,
}) => {
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="w-full h-8 bg-slate-200 rounded-lg mb-8 text-center text-xs font-bold text-slate-400 leading-8 tracking-widest uppercase shadow-inner">
        Screen / Stage
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4 justify-items-center">
        {seats.map((seatNum) => {
          const isBooked = bookedSeats.includes(seatNum);
          const isSelected = selectedSeats.includes(seatNum);

          return (
            <button
              key={seatNum}
              disabled={isBooked}
              onClick={() => onToggleSeat(seatNum)}
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-t-xl rounded-b-md text-sm font-semibold transition-all duration-200 flex items-center justify-center shadow-sm",
                isBooked
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                  : isSelected
                  ? "bg-indigo-600 text-white transform scale-105 ring-2 ring-indigo-300 shadow-md"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 hover:shadow"
              )}
              title={isBooked ? `Seat ${seatNum} (Booked)` : `Seat ${seatNum}`}
            >
              {seatNum}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-6 mt-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white border border-slate-200"></div>
          <span className="text-sm text-slate-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600"></div>
          <span className="text-sm text-slate-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-slate-300 opacity-60"></div>
          <span className="text-sm text-slate-600">Booked</span>
        </div>
      </div>
    </div>
  );
};