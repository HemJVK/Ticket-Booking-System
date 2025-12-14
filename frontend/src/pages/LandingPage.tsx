import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import { useTicket } from '../context/TicketContext';
import { motion } from 'framer-motion';
import { Play, Calendar, Star } from 'lucide-react';

const LandingPage = () => {
    const { shows, loading } = useTicket();

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true, // Cinematic fade
        cssEase: 'linear'
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-cinema-900 text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cinema-red"></div>
        </div>
    );

    const featured = shows.slice(0, 5);

    // Helper for placeholder images
    const getHeroImage = (id: number) => `https://picsum.photos/seed/moviehero${id}/1920/1080`;
    const getPosterImage = (id: number) => `https://picsum.photos/seed/movieposter${id}/300/450`;

    return (
        <div className="bg-cinema-900 min-h-screen pb-20">
            {/* Hero Slider */}
            <div className="relative mb-12 group">
                <Slider {...sliderSettings} className="overflow-hidden">
                    {featured.map(show => (
                        <div key={show.id} className="relative h-[80vh] w-full outline-none">
                            {/* Background Image with Gradient */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear transform group-hover:scale-105"
                                style={{ backgroundImage: `url(${show.image_url || getHeroImage(show.id)})` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-cinema-900 via-cinema-900/60 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-cinema-900 via-transparent to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-end pb-24 md:pb-32">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="max-w-2xl"
                                >
                                    <div className="flex items-center gap-2 mb-4 text-cinema-red font-bold tracking-widest uppercase text-sm">
                                        <span className="bg-cinema-red/20 px-2 py-1 rounded">Now Showing</span>
                                        <span className="flex items-center gap-1 text-cinema-gold"><Star size={14} fill="currentColor" /> 4.8</span>
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-bold mb-4 text-white leading-tight shadow-black drop-shadow-lg">
                                        {show.name}
                                    </h2>
                                    <p className="text-gray-300 text-lg mb-8 line-clamp-2 max-w-xl">
                                        {show.description || "Experience the thrill of cinema with our latest blockbuster. Book your seats now for an unforgettable journey."}
                                    </p>

                                    <div className="flex gap-4">
                                        <Link to={`/movie/${show.id}`} className="flex items-center gap-2 bg-cinema-red text-white px-8 py-4 rounded-full font-bold hover:bg-red-700 transition transform hover:scale-105 shadow-lg shadow-red-900/50">
                                            <Play size={20} fill="currentColor" /> Book Now
                                        </Link>
                                        <Link to={`/movie/${show.id}`} className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition">
                                            Details
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* Movie List */}
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold border-l-4 border-cinema-red pl-4">Trending Now</h2>
                    <a href="#" className="text-cinema-red hover:text-white transition">View All</a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {shows.map((show, index) => (
                        <motion.div
                            key={show.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ y: -10 }}
                            className="group relative bg-cinema-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cinema-red/20 transition-all duration-300"
                        >
                            <div className="aspect-[2/3] overflow-hidden">
                                <img
                                    src={show.image_url || getPosterImage(show.id)}
                                    alt={show.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                                    <Link to={`/movie/${show.id}`} className="bg-cinema-red text-white px-6 py-2 rounded-full font-bold transform scale-90 group-hover:scale-100 transition duration-300 shadow-lg">
                                        Book Ticket
                                    </Link>
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-b from-cinema-800 to-cinema-900">
                                <h3 className="font-bold text-lg mb-1 truncate text-white group-hover:text-cinema-red transition">{show.name}</h3>
                                <div className="flex items-center justify-between text-sm text-gray-400">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(show.start_time).toLocaleDateString()}</span>
                                    <span className="text-cinema-gold flex items-center gap-1"><Star size={12} /> 4.5</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
