'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactUsPage() {
    return (
        <>
            <Header />
            <div className="bg-white min-h-screen pt-32 pb-20 relative overflow-hidden">
                {/* Background Map Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'0 0 2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center tracking-tight">
                        Contact Us
                    </h1>

                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-20">

                        {/* Tokyo Square Branch */}
                        <div className="flex flex-col gap-6">
                            <div className="relative group w-full mx-auto max-w-md">
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wider whitespace-nowrap z-20 shadow-lg">
                                    Tokyo Square Branch
                                </div>
                                <div className="bg-gradient-to-r from-[#FF512F] to-[#F09819] rounded-2xl p-8 pt-10 text-white text-center shadow-xl transform transition-transform hover:scale-[1.02]">
                                    <div className="space-y-1 text-sm font-medium leading-relaxed">
                                        <p>SHOP: 616, 643</p>
                                        <p>LEVEL: 6, TOKYO SQUARE</p>
                                        <p>JAPAN GARDEN CITY</p>
                                        <p>MOHAMMADPUR, DHAKA</p>
                                    </div>
                                </div>
                            </div>

                            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.056674347744!2d90.3592883!3d23.7659883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0a2f5d5e5d5%3A0x6a6c0c0c0c0c0c0c!2sTokyo%20Square!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>

                        {/* Bashundhara Branch */}
                        <div className="flex flex-col gap-6">
                            <div className="relative group w-full mx-auto max-w-md">
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wider whitespace-nowrap z-20 shadow-lg">
                                    Bashundhara Branch
                                </div>
                                <div className="bg-gradient-to-r from-[#FF512F] to-[#F09819] rounded-2xl p-8 pt-10 text-white text-center shadow-xl transform transition-transform hover:scale-[1.02]">
                                    <div className="space-y-1 text-sm font-medium leading-relaxed">
                                        <p>SHOP: 1, 2 | 12, 13</p>
                                        <p>LEVEL: 6, BLOCK: D,</p>
                                        <p>BASHUNDHARA CITY SHOPPING MALL</p>
                                        <p>PANTHAPATH, DHAKA</p>
                                    </div>
                                </div>
                            </div>

                            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902442430136!2d90.3905166!3d23.7508581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b888ad3dd41d%3A0xde4467b998a7c69e!2sBashundhara%20City%20Shopping%20Complex!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>

                    </div>

                    {/* General Contact Info */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 text-center max-w-3xl mx-auto shadow-xl border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-900">Phone</p>
                                    <a href="tel:+8801842430000" className="text-gray-600 hover:text-blue-600">+880 1842-430000</a>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-900">WhatsApp</p>
                                    <a href="https://wa.me/8801842430000" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600">+880 1842-430000</a>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-900">Email</p>
                                    <a href="mailto:info@appleians.com" className="text-gray-600 hover:text-orange-600">info@appleians.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
