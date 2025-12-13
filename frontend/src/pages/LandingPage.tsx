import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import { useTicket } from '../context/TicketContext';

const LandingPage = () => {
    const { shows, loading } = useTicket();

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    if (loading) return <div className="p-10 text-center">Loading Movies...</div>;

    // Featured movies (first 3 or mock)
    const featured = shows.slice(0, 5);

    return (
        <div>
            {/* Hero Slider */}
            <div className="mb-8">
                <Slider {...sliderSettings} className="overflow-hidden">
                    {featured.map(show => (
                        <div key={show.id} className="relative h-64 md:h-96 bg-gray-900 text-white flex items-center justify-center">
                            {/* Placeholder for Image - in real app use show.image_url */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
                                <h2 className="text-4xl font-bold mb-2">{show.name}</h2>
                                <p className="mb-4">{new Date(show.start_time).toLocaleDateString()}</p>
                                <Link to={`/movie/${show.id}`} className="bg-red-600 px-6 py-2 rounded font-bold hover:bg-red-700">
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    ))}
                    {featured.length === 0 && (
                        <div className="h-64 bg-gray-800 flex items-center justify-center text-white">
                            <h2>No featured movies</h2>
                        </div>
                    )}
                </Slider>
            </div>

            {/* Movie List */}
            <div className="container mx-auto px-4 mb-10">
                <h2 className="text-2xl font-bold mb-6 border-l-4 border-red-600 pl-3">Now Showing</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {shows.map(show => (
                        <div key={show.id} className="bg-white rounded shadow hover:shadow-lg transition flex flex-col">
                            <div className="h-40 bg-gray-300 rounded-t flex items-center justify-center text-gray-500">
                                {show.image_url ? <img src={show.image_url} alt={show.name} className="h-full w-full object-cover" /> : 'No Image'}
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg mb-1 truncate">{show.name}</h3>
                                <p className="text-sm text-gray-600 mb-4">{new Date(show.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                <Link to={`/movie/${show.id}`} className="mt-auto block text-center bg-gray-900 text-white py-2 rounded hover:bg-gray-700">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
