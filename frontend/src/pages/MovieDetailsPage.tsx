import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Show } from '../types';

const MovieDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [show, setShow] = useState<Show | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/shows/${id}`)
            .then(res => setShow(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!show) return <div>Movie not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 bg-gray-200 h-96 flex items-center justify-center rounded">
                     {/* Image Placeholder */}
                     <span className="text-gray-500 text-xl">Movie Poster</span>
                </div>
                <div className="w-full md:w-2/3">
                    <h1 className="text-4xl font-bold mb-2">{show.name}</h1>
                    <p className="text-xl text-gray-600 mb-4">{new Date(show.start_time).toLocaleString()}</p>

                    <div className="mb-6">
                        <h3 className="font-bold text-lg mb-2">Synopsis</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {show.description || "No description available for this movie."}
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded border mb-6">
                         <p className="font-semibold">Price per ticket: $10</p>
                         <p className="font-semibold">Total Seats: {show.total_seats}</p>
                    </div>

                    <Link to={`/booking/${show.id}`} className="inline-block bg-red-600 text-white px-8 py-3 rounded text-lg font-bold hover:bg-red-700 transition">
                        Book Tickets
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
