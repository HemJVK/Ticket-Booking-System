import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShowCard } from '../components/ShowCard';
import { mockApi } from '../services/mockApi';

export const AdminDashboard: React.FC = () => {
  const { shows, refreshShows, addNotification } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startTime: '',
    totalSeats: 40,
    price: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.startTime || formData.totalSeats <= 0) {
      addNotification("Please fill all required fields correctly.", 'error');
      return;
    }

    setIsCreating(true);
    try {
      await mockApi.createShow({
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
      });
      await refreshShows();
      addNotification("Show created successfully!", 'success');
      setFormData({ name: '', description: '', startTime: '', totalSeats: 40, price: 0 }); // Reset
    } catch (err) {
      addNotification("Failed to create show.", 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Show / Trip</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Event / Bus / Doctor Name"
              id="name"
              name="name"
              placeholder="e.g. Avengers Premiere, Bus to NYC, Dr. Smith"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Description (Optional)"
              id="description"
              name="description"
              placeholder="Brief details about the event"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              label="Start Time"
              id="startTime"
              name="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <Input
                label="Total Seats"
                id="totalSeats"
                name="totalSeats"
                type="number"
                min="1"
                max="100"
                value={formData.totalSeats}
                onChange={handleInputChange}
                required
            />
             <Input
                label="Price ($)"
                id="price"
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                required
            />
          </div>
          
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" isLoading={isCreating} className="w-full md:w-auto">
              Create Event
            </Button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Existing Shows</h2>
        {shows.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">No shows available. Create one above.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shows.map(show => (
                <ShowCard key={show.id} show={show} onBook={() => {}} isAdmin />
            ))}
            </div>
        )}
      </div>
    </div>
  );
};