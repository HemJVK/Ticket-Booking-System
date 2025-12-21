import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ShowCard } from '../components/ShowCard';
import { Input } from '../components/ui/Input';

interface UserDashboardProps {
  onNavigateToBooking: (showId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigateToBooking }) => {
  const { shows, isLoadingShows } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShows = useMemo(() => {
    if (!searchQuery.trim()) return shows;
    const query = searchQuery.toLowerCase();
    return shows.filter(show => 
      show.name.toLowerCase().includes(query) || 
      show.description?.toLowerCase().includes(query)
    );
  }, [shows, searchQuery]);

  if (isLoadingShows) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Available Events</h1>
        <div className="w-full sm:w-72">
            <Input 
                placeholder="Search events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white"
            />
        </div>
      </div>

      {filteredShows.length === 0 ? (
         <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">
                {searchQuery ? "No events match your search." : "No events currently available. Check back later!"}
            </p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredShows.map(show => (
            <ShowCard 
                key={show.id} 
                show={show} 
                onBook={onNavigateToBooking} 
            />
          ))}
        </div>
      )}
    </div>
  );
};