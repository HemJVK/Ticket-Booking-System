import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Show, Booking } from '../types';
import axios from 'axios';

interface TicketContextType {
  shows: Show[];
  refreshShows: () => Promise<void>;
  loading: boolean;
  error: string | null;
  userId: number; // Added mock Auth state
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock Auth State: User ID is consistent per session
  const [userId] = useState<number>(() => {
      const stored = localStorage.getItem('mock_user_id');
      if (stored) return Number(stored);
      const newId = Math.floor(Math.random() * 10000) + 1;
      localStorage.setItem('mock_user_id', newId.toString());
      return newId;
  });

  const refreshShows = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/shows');
      setShows(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch shows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshShows();
  }, []);

  return (
    <TicketContext.Provider value={{ shows, refreshShows, loading, error, userId }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTicket = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicket must be used within a TicketProvider');
  }
  return context;
};
