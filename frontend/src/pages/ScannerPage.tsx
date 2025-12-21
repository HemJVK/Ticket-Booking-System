import React, { useState } from 'react';
import axios from 'axios';

const ScannerPage = () => {
    const [code, setCode] = useState('');
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResult(null);
        try {
            const res = await axios.post('http://localhost:3000/api/payment/verify', { code });
            setResult(res.data.ticket);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification Failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-8 mt-10">Theatre Scanner</h1>

            <form onSubmit={handleScan} className="w-full max-w-md bg-gray-800 p-6 rounded mb-8">
                <label className="block mb-2 text-gray-400">Enter QR Code / Ticket ID</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                        placeholder="TICKET-..."
                    />
                    <button type="submit" className="bg-blue-600 px-6 py-2 rounded font-bold hover:bg-blue-500">
                        VERIFY
                    </button>
                </div>
            </form>

            {result && (
                <div className="bg-green-600 p-6 rounded-lg max-w-md w-full text-center shadow-lg animate-pulse">
                    <h2 className="text-4xl font-bold mb-2">VALID TICKET</h2>
                    <p className="text-xl">{result.show_name}</p>
                    <p className="opacity-80">{new Date(result.start_time).toLocaleString()}</p>
                    <div className="mt-4 bg-white/20 p-2 rounded">
                        <p className="font-bold">Seat: {result.seat_number}</p>
                        <p>User ID: {result.user_id}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-600 p-6 rounded-lg max-w-md w-full text-center shadow-lg">
                    <h2 className="text-3xl font-bold mb-2">INVALID</h2>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default ScannerPage;
