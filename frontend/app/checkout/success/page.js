'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your purchase. We have received your order and will contact you shortly for confirmation.
                </p>
                <div className="space-y-3">
                    <Link
                        href="/"
                        className="block w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                    <Link
                        href="/dashboard/orders"
                        className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                        View Order Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
