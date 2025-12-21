import React from 'react';
import { useTicket } from '../context/TicketContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { shows, loading, error } = useTicket();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Shows / Appointments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shows.map((show) => (
          <div key={show.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">{show.name}</h2>
            <p className="text-gray-600">
              {new Date(show.start_time).toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-gray-500">{show.total_seats} seats total</p>
            <Link
              to={`/booking/${show.id}`}
              className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Book Now
            </Link>
          </div>
        ))}
      </div>
      {shows.length === 0 && <p>No shows available.</p>}
    </div>
  );
};

export default HomePage;
