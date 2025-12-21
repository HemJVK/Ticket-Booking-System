import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const { state } = useLocation(); // Passed from BookingPage
    const { user } = useAuth();
    const navigate = useNavigate();
    const [method, setMethod] = useState('GOOGLE_PAY');
    const [processing, setProcessing] = useState(false);

    const amount = state?.amount || 10; // Default or passed

    const handlePayment = async () => {
        setProcessing(true);
        try {
            const res = await axios.post('http://localhost:3000/api/payment/pay', {
                bookingId: bookingId,
                amount: amount,
                paymentMethod: method
            });

            // Redirect to Ticket Page
            navigate(`/ticket/${res.data.ticketCode}`, { state: { bookingId } });
        } catch (error) {
            alert('Payment Failed');
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Payment Gateway</h2>
                <div className="mb-4">
                    <p className="text-gray-600">Booking ID: <span className="font-mono text-black">{bookingId}</span></p>
                    <p className="text-gray-600">Total Amount: <span className="font-bold text-green-600">${amount}</span></p>
                </div>

                <h3 className="font-semibold mb-2">Select Payment Method</h3>
                <div className="space-y-2 mb-6">
                    <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50 bg-blue-50 border-blue-200">
                        <input
                            type="radio"
                            name="payment"
                            value="GOOGLE_PAY"
                            checked={method === 'GOOGLE_PAY'}
                            onChange={(e) => setMethod(e.target.value)}
                            className="mr-3"
                        />
                        <span className="font-medium">Google Pay</span>
                    </label>
                    <label className="flex items-center p-3 border rounded opacity-50 cursor-not-allowed">
                        <input type="radio" name="payment" disabled className="mr-3"/>
                        <span>Credit Card (Disabled)</span>
                    </label>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 disabled:opacity-70 flex justify-center"
                >
                    {processing ? 'Processing...' : `Pay $${amount} with GPay`}
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;
