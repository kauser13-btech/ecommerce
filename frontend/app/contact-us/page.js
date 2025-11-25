export default function ContactUsPage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    {/* Tokyo Square Branch */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900">Tokyo Square Branch</h2>
                        <div className="text-gray-600 space-y-1">
                            <p>Shop: 616, 643</p>
                            <p>Level: 6, Tokyo Square</p>
                            <p>Japan Garden City</p>
                            <p>Mohammadpur, Dhaka</p>
                        </div>
                        <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
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
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900">Bashundhara Branch</h2>
                        <div className="text-gray-600 space-y-1">
                            <p>Shop: 1, 2 | 12, 13</p>
                            <p>Level: 6, Block: D</p>
                            <p>Bashundhara City Shopping Mall</p>
                            <p>Panthapath, Dhaka</p>
                        </div>
                        <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
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
                <div className="bg-gray-50 rounded-2xl p-8 text-center max-w-2xl mx-auto">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
                    <div className="space-y-4">
                        <p className="flex items-center justify-center gap-2 text-gray-700">
                            <span className="font-medium">Phone:</span>
                            <a href="tel:+8801842430000" className="hover:text-blue-600">+880 1842-430000</a>
                        </p>
                        <p className="flex items-center justify-center gap-2 text-gray-700">
                            <span className="font-medium">WhatsApp:</span>
                            <a href="https://wa.me/8801842430000" target="_blank" rel="noopener noreferrer" className="hover:text-green-600">+880 1842-430000</a>
                        </p>
                        <p className="flex items-center justify-center gap-2 text-gray-700">
                            <span className="font-medium">Email:</span>
                            <a href="mailto:info@appleians.com" className="hover:text-blue-600">info@appleians.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
