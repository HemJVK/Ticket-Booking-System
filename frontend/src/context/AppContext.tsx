import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Show, Role } from '../types';
import { mockApi } from '../services/mockApi';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  shows: Show[];
  isLoadingShows: boolean;
  refreshShows: () => Promise<void>;
  notifications: { id: string; message: string; type: 'success' | 'error' }[];
  addNotification: (message: string, type: 'success' | 'error') => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('USER');
  const [shows, setShows] = useState<Show[]>([]);
  const [isLoadingShows, setIsLoadingShows] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'success' | 'error' }[]>([]);

  const addNotification = useCallback((message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const refreshShows = useCallback(async () => {
    setIsLoadingShows(true);
    try {
      const data = await mockApi.getShows();
      // Sort by start time
      data.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      setShows(data);
    } catch (error) {
      addNotification("Failed to load shows", 'error');
    } finally {
      setIsLoadingShows(false);
    }
  }, [addNotification]);

  useEffect(() => {
    refreshShows();
  }, [refreshShows]);

  return (
    <AppContext.Provider value={{
      role,
      setRole,
      shows,
      isLoadingShows,
      refreshShows,
      notifications,
      addNotification,
      removeNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};