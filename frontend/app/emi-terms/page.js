'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function EmiTermsPage() {
    const banks = [
        { name: 'Standard Chartered Bank', months: ['3', '6', '9', '12', '18', '24', '36'], minAmount: '5,000' },
        { name: 'City Bank (Amex/Visa/Master)', months: ['3', '6', '9', '12', '18', '24', '36'], minAmount: '5,000' },
        { name: 'BRAC Bank', months: ['3', '6', '9', '12', '18', '24', '36'], minAmount: '5,000' },
        { name: 'Eastern Bank Ltd (EBL)', months: ['3', '6', '9', '12', '18', '24', '36'], minAmount: '5,000' },
        { name: 'Dutch-Bangla Bank (DBBL)', months: ['3', '6', '9', '12', '18', '24', '36'], minAmount: '5,000' },
        { name: 'Southeast Bank', months: ['3', '6', '9', '12', '18', '24', '-'], minAmount: '5,000' },
        { name: 'Mutual Trust Bank (MTB)', months: ['3', '6', '9', '12', '18', '24', '-'], minAmount: '5,000' },
        { name: 'Prime Bank', months: ['3', '6', '9', '12', '18', '24', '-'], minAmount: '5,000' },
        { name: 'Dhaka Bank', months: ['3', '6', '9', '12', '18', '24', '-'], minAmount: '5,000' },
        { name: 'Bank Asia', months: ['3', '6', '9', '12', '18', '24', '-'], minAmount: '5,000' },
        { name: 'United Commercial Bank (UCB)', months: ['3', '6', '9', '12', '18', '24', '-'], minAmount: '5,000' },
        { name: 'LankaBangla Finance', months: ['3', '6', '9', '12', '18', '24', '36'], minAmount: '5,000' },
    ];

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white pt-32 pb-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 uppercase tracking-wide">EMI Terms & Conditions</h1>

                        <div className="prose max-w-none text-gray-600 mb-12 text-center">
                            <p className="text-lg">
                                Our Website offer prices are Cash and Bank transfer or Bank App Transfer or bKash etc only.
                                For EMI, bank charges will be applicable on the device price.
                            </p>
                        </div>

                        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-white uppercase bg-black">
                                        <tr>
                                            <th className="px-6 py-4 font-bold tracking-wider">Bank Name</th>
                                            <th className="px-6 py-4 text-center">3 Months</th>
                                            <th className="px-6 py-4 text-center">6 Months</th>
                                            <th className="px-6 py-4 text-center">9 Months</th>
                                            <th className="px-6 py-4 text-center">12 Months</th>
                                            <th className="px-6 py-4 text-center">18 Months</th>
                                            <th className="px-6 py-4 text-center">24 Months</th>
                                            <th className="px-6 py-4 text-center">36 Months</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {banks.map((bank, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-gray-900">{bank.name}</td>
                                                {bank.months.map((status, i) => (
                                                    <td key={i} className="px-6 py-4 text-center">
                                                        {status === '-' ? (
                                                            <span className="text-gray-300">-</span>
                                                        ) : (
                                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-12 space-y-6 text-gray-600">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Important Notes:</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>EMI facilities are valid for credit card holders of the listed banks only.</li>
                                    <li>Minimum purchase amount to avail EMI is BDT 5,000.</li>
                                    <li>There are no hidden charges from our side. The bank might charge a processing fee as per their policy.</li>
                                    <li>EMI approval is at the sole discretion of the card-issuing bank.</li>
                                </ul>
                            </div>

                            <div className="text-center text-sm">
                                <p>For any queries regarding EMI, please contact our hotline: <span className="font-bold text-black">01842430000</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
