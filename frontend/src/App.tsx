import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import PaymentPage from './pages/PaymentPage';
import TicketPage from './pages/TicketPage';
import ScannerPage from './pages/ScannerPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const NavBar = () => {
    const { user, logout } = useAuth();
    return (
      <nav className="bg-white shadow p-4 mb-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-bold text-xl text-red-600 tracking-tighter">
          <Link to="/">MOVIES<span className="text-black">NOW</span></Link>
        </div>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-red-500 font-medium">Home</Link>
          {user ? (
              <>
                 <span className="text-gray-600">Hi, {user.name}</span>
                 <button onClick={logout} className="text-red-500 hover:text-red-700">Logout</button>
              </>
          ) : (
              <Link to="/login" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Login</Link>
          )}
          <Link to="/admin" className="text-sm text-gray-400 hover:text-gray-600">Admin</Link>
        </div>
      </nav>
    );
};

function App() {
  return (
    <AuthProvider>
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <NavBar />
      <main className="container mx-auto pb-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/ticket/:code" element={<TicketPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
        </Routes>
      </main>
    </div>
    </AuthProvider>
  );
}

export default App;
