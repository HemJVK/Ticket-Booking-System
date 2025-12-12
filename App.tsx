import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { BookingPage } from './pages/BookingPage';
import { MyBookings } from './pages/MyBookings';

// Simple Router Component
const AppContent: React.FC = () => {
  const { role } = useApp();
  const [currentRoute, setCurrentRoute] = useState<{ page: 'HOME' | 'BOOKING' | 'MY_BOOKINGS'; params?: any }>({ page: 'HOME' });

  // Reset route when role changes
  useEffect(() => {
    setCurrentRoute({ page: 'HOME' });
  }, [role]);

  const navigateToBooking = (showId: string) => {
    setCurrentRoute({ page: 'BOOKING', params: { showId } });
  };

  const navigateHome = () => {
    setCurrentRoute({ page: 'HOME' });
  };

  const navigateToMyBookings = () => {
    setCurrentRoute({ page: 'MY_BOOKINGS' });
  };

  if (role === 'ADMIN') {
    return (
        <Layout onNavigateToMyBookings={() => {}} currentRoute="HOME">
            <AdminDashboard />
        </Layout>
    );
  }

  // User Role
  return (
    <Layout onNavigateToMyBookings={navigateToMyBookings} onNavigateHome={navigateHome} currentRoute={currentRoute.page}>
      {currentRoute.page === 'HOME' && (
        <UserDashboard onNavigateToBooking={navigateToBooking} />
      )}
      {currentRoute.page === 'BOOKING' && currentRoute.params && (
        <BookingPage 
            showId={currentRoute.params.showId} 
            onBack={navigateHome} 
        />
      )}
      {currentRoute.page === 'MY_BOOKINGS' && (
        <MyBookings />
      )}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;