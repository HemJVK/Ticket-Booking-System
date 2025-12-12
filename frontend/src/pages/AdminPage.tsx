import React, { useState } from 'react';
import axios from 'axios';
import { useTicket } from '../context/TicketContext';

const AdminPage = () => {
  const { refreshShows } = useTicket();
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [totalSeats, setTotalSeats] = useState(40);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/shows', {
        name,
        start_time: startTime,
        total_seats: Number(totalSeats),
      });
      setMsg('Show created successfully!');
      setName('');
      setStartTime('');
      refreshShows();
    } catch (error) {
      setMsg('Error creating show');
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700">Show Name / Doctor Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Time</label>
          <input
            type="datetime-local"
            className="w-full border p-2 rounded"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Total Seats (if applicable)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={totalSeats}
            onChange={(e) => setTotalSeats(Number(e.target.value))}
            required
            min="1"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Show
        </button>
        {msg && <p className="mt-2 text-green-600">{msg}</p>}
      </form>
    </div>
  );
};

export default AdminPage;
