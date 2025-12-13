import React from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

const TicketPage = () => {
    const { code } = useParams<{ code: string }>();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center border-t-8 border-red-600 relative overflow-hidden">
                <div className="absolute -left-3 top-1/2 w-6 h-6 bg-gray-100 rounded-full"></div>
                <div className="absolute -right-3 top-1/2 w-6 h-6 bg-gray-100 rounded-full"></div>

                <h1 className="text-3xl font-bold mb-1 tracking-wider text-gray-800">TICKET</h1>
                <p className="text-gray-500 text-sm mb-6 uppercase tracking-widest">Confirmed Booking</p>

                <div className="flex justify-center mb-6">
                    <QRCodeCanvas value={code || ''} size={200} />
                </div>

                <div className="bg-gray-50 p-4 rounded mb-4">
                     <p className="text-xs text-gray-400 uppercase">Ticket Code</p>
                     <p className="font-mono text-lg font-bold text-gray-800 break-all">{code}</p>
                </div>

                <p className="text-sm text-gray-600">Scan this QR code at the theatre entrance.</p>

                <div className="mt-8 border-t pt-4">
                     <button onClick={() => window.print()} className="text-blue-600 hover:underline">Download / Print</button>
                     <span className="mx-2 text-gray-300">|</span>
                     <a href="/" className="text-blue-600 hover:underline">Home</a>
                </div>
            </div>
        </div>
    );
};

export default TicketPage;
