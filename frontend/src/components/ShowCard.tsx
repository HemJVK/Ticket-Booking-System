import React from 'react';
import { Show } from '../types';
import { Button } from './ui/Button';

interface ShowCardProps {
  show: Show;
  onBook: (showId: string) => void;
  isAdmin?: boolean;
}

export const ShowCard: React.FC<ShowCardProps> = ({ show, onBook, isAdmin }) => {
  const date = new Date(show.startTime);
  const formattedDate = date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const formattedTime = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{show.name}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                ${show.price}
            </span>
        </div>
        
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{show.description || "No description provided."}</p>
        
        <div className="flex items-center text-sm text-slate-600 mb-2">
          <svg className="mr-2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {formattedDate}
        </div>
        <div className="flex items-center text-sm text-slate-600 mb-4">
          <svg className="mr-2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {formattedTime}
        </div>

        <div className="flex items-center text-sm text-slate-600">
           <svg className="mr-2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
           {show.totalSeats} seats total
        </div>
      </div>
      
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
        <Button 
            onClick={() => onBook(show.id)} 
            className="w-full"
            variant={isAdmin ? "secondary" : "primary"}
            disabled={isAdmin}
        >
          {isAdmin ? 'View Only' : 'Book Seats'}
        </Button>
      </div>
    </div>
  );
};