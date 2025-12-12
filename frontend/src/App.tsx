import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="bg-white shadow p-4 mb-4 flex justify-between items-center">
        <div className="font-bold text-xl text-blue-600">
          <Link to="/">Modex Ticket System</Link>
        </div>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-500">Home</Link>
          <Link to="/admin" className="hover:text-blue-500">Admin</Link>
        </div>
      </nav>
      <main className="container mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
