import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Show } from '../types';
import { motion } from 'framer-motion';
import { Clock, Calendar, Users, Star, ArrowLeft } from 'lucide-react';

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

    if (loading) return (
        <div className="min-h-screen bg-cinema-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinema-red"></div>
        </div>
    );
    if (!show) return <div className="text-white text-center mt-20">Movie not found</div>;

    const heroImage = show.image_url || `https://picsum.photos/seed/moviehero${id}/1920/1080`;
    const posterImage = show.image_url || `https://picsum.photos/seed/movieposter${id}/300/450`;

    return (
        <div className="bg-cinema-900 min-h-screen text-white relative">
            {/* Backdrop */}
            <div className="absolute top-0 left-0 w-full h-[70vh] overflow-hidden opacity-40">
                <img src={heroImage} alt="Backdrop" className="w-full h-full object-cover blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-b from-cinema-900/10 via-cinema-900/80 to-cinema-900"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 pt-24 pb-12">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <div className="flex flex-col md:flex-row gap-12 items-start">
                    {/* Poster */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full md:w-1/3 lg:w-1/4 shrink-0"
                    >
                        <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                            <img src={posterImage} alt={show.name} className="w-full h-auto object-cover" />
                        </div>
                    </motion.div>

                    {/* Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <span className="bg-cinema-red px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Now Showing</span>
                            <span className="flex items-center gap-1 text-cinema-gold"><Star size={16} fill="currentColor" /> 4.8 Rating</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">{show.name}</h1>

                        <div className="flex flex-wrap gap-6 text-gray-300 mb-8 text-sm md:text-base">
                            <span className="flex items-center gap-2"><Calendar size={18} className="text-cinema-red"/> {new Date(show.start_time).toLocaleDateString()}</span>
                            <span className="flex items-center gap-2"><Clock size={18} className="text-cinema-red"/> {new Date(show.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span className="flex items-center gap-2"><Users size={18} className="text-cinema-red"/> {show.total_seats} Seats</span>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Synopsis</h3>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {show.description || "Immerse yourself in this spectacular journey. A story of passion, adventure, and the human spirit. Don't miss out on the cinematic event of the year."}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                             <div className="flex-1">
                                 <p className="text-sm text-gray-400">Price per ticket</p>
                                 <p className="text-3xl font-bold text-cinema-gold">$10.00</p>
                             </div>
                             <Link
                                to={`/booking/${show.id}`}
                                className="w-full sm:w-auto bg-cinema-red text-white px-10 py-4 rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/40 text-center"
                            >
                                Book Tickets
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
