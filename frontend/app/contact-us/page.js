'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram } from 'lucide-react';

export default function ContactUsPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSending(false);
    };

    return (
        <>
            <Header />

            {/* Added pt-36 to clear fixed header and add spacing */}
            <div className="bg-gray-50 min-h-screen pt-36 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Hero Section */}
                    <div className="text-center mb-16 max-w-2xl mx-auto animate-in slide-in-from-bottom-5 duration-700">
                        <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">Get in Touch</h2>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                            We'd Love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Hear From You</span>
                        </h1>
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <span className="text-sm font-bold text-gray-400">FOLLOW US</span>
                            <div className="h-px w-8 bg-gray-200"></div>
                            <div className="flex gap-3">
                                <a href="https://www.facebook.com/appleians" target="_blank" className="w-9 h-9 bg-white border border-gray-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-sm">
                                    <Facebook size={16} />
                                </a>
                                <a href="https://www.instagram.com/appleiansbd" target="_blank" className="w-9 h-9 bg-white border border-gray-100 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-300 shadow-sm">
                                    <Instagram size={16} />
                                </a>
                                <a href="https://tiktok.com/@appleians" target="_blank" className="w-9 h-9 bg-white border border-gray-100 rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white hover:border-black transition-all duration-300 shadow-sm">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                                </a>
                            </div>
                        </div>
                        <p className="text-lg text-gray-600">
                            Have a question about our products or services? We're here to help. Send us a message or visit one of our stores.
                        </p>
                    </div>

                    {/* Top Row: Contact Info & Form */}
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
                        {/* Contact Info */}
                        <div className="h-full">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full flex flex-col justify-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">PHONE</p>
                                            <a href="tel:01842430000" className="text-gray-900 font-semibold hover:text-blue-600 transition-colors">+880 1842-430000</a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">EMAIL</p>
                                            <a href="mailto:info@appleians.com" className="text-gray-900 font-semibold hover:text-purple-600 transition-colors">info@appleians.com</a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 flex-shrink-0">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-2">ADDRESSES</p>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-gray-900 font-bold text-sm">TOKYO SQUARE BRANCH</p>
                                                    <p className="text-gray-600 text-sm">Shop: 616, 643 | Level: 6, Tokyo Square</p>
                                                    <p className="text-gray-600 text-sm">Japan Garden City, Mohammadpur, Dhaka</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-900 font-bold text-sm">BASHUNDHARA BRANCH</p>
                                                    <p className="text-gray-600 text-sm">Shop: 1, 2 | 12, 13</p>
                                                    <p className="text-gray-600 text-sm">Level: 6, Block: D, Bashundhara City</p>
                                                    <p className="text-gray-600 text-sm">Panthapath, Dhaka</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">WORKING HOURS</p>
                                            <p className="text-gray-900 font-medium">Daily: 10:00 AM - 9:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="h-full lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-10 relative overflow-hidden h-full flex flex-col justify-center">
                                {/* Decorative blob */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-8 relative z-10">Send us a Message</h3>

                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                                placeholder="Your Full Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                                placeholder="Your Email Address"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                            placeholder="How can we help?"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                        <textarea
                                            id="message"
                                            rows={6}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                                            placeholder="Write your message here..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={sending}
                                            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed group"
                                        >
                                            {sending ? 'Sending...' : 'Send Message'}
                                            {!sending && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Maps Section - Side by Side */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Bashundhara Branch Map */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Bashundhara Branch</h3>
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=Bashundhara+City+Shopping+Complex"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    <MapPin size={16} className="mr-1" />
                                    Get Directions
                                </a>
                            </div>
                            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-80 relative group">
                                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center animate-pulse">
                                    <span className="text-gray-400 font-medium">Loading Map...</span>
                                </div>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902442430136!2d90.3905166!3d23.7508581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b888ad3dd41d%3A0xde4467b998a7c69e!2sBashundhara%20City%20Shopping%20Complex!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd"
                                    className="w-full h-full relative z-10"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>

                        {/* Tokyo Square Branch Map */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Tokyo Square Branch</h3>
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=Tokyo+Square+Shopping+Mall+Mohammadpur"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    <MapPin size={16} className="mr-1" />
                                    Get Directions
                                </a>
                            </div>
                            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-80 relative group">
                                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center animate-pulse">
                                    <span className="text-gray-400 font-medium">Loading Map...</span>
                                </div>
                                <iframe
                                    src="https://maps.google.com/maps?q=Tokyo%20Square%20Shopping%20Mall%20Mohammadpur&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                    className="w-full h-full relative z-10"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
