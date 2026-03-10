import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] text-gray-400 pt-16 lg:pt-24 pb-8 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-12 lg:mb-16">

          {/* Column 1: Brand (lg: 4 cols) */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4 sm:space-y-6 flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link href="/" className="inline-block">
              {/* Force logo to be white in dark theme */}
              <img src="/logo.png" alt="Appleians" className="h-10 sm:h-12 w-auto brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Your premium destination for authentic Apple products in Bangladesh. Experience excellence with every purchase.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://www.facebook.com/appleians" target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all text-zinc-400">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/appleiansbd" target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-pink-600 hover:border-pink-600 hover:text-white transition-all text-zinc-400">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://tiktok.com/@appleians" target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-white hover:border-white hover:text-black transition-all text-zinc-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (lg: 2 cols) */}
          <div className="lg:col-span-2 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h3 className="text-sm font-semibold mb-4 sm:mb-6 text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { name: 'All Products', href: '/products' },
                { name: 'Blogs', href: '/blogs' },
                { name: 'New Arrivals', href: '/products?filter=new' },
                { name: 'EMI Policy', href: '/emi-terms' },
                { name: 'Terms & Conditions', href: '/terms' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-zinc-400 text-xs sm:text-sm hover:text-orange-500 transition-colors flex items-center justify-center sm:justify-start gap-2 group">
                    <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-orange-500 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact (lg: 3 cols) */}
          <div className="lg:col-span-3 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h3 className="text-sm font-semibold mb-4 sm:mb-6 text-white uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-5 sm:space-y-6">
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-900 border border-zinc-800 flex shrink-0 items-center justify-center text-orange-500">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-widest mb-0.5 sm:mb-1">Hotline</p>
                  <a href="tel:01842430000" className="text-white text-xs sm:text-sm hover:text-orange-500 transition-colors font-medium">01842 - 430000</a>
                </div>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-900 border border-zinc-800 flex shrink-0 items-center justify-center text-orange-500">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-widest mb-0.5 sm:mb-1">Tokyo Square Branch</p>
                    <p className="text-zinc-400 sm:text-zinc-300 text-xs sm:text-sm leading-relaxed">Shop: 616, 643 | Level: 6<br />Japan Garden City, Mohammadpur</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-widest mb-0.5 sm:mb-1">Bashundhara Branch</p>
                    <p className="text-zinc-400 sm:text-zinc-300 text-xs sm:text-sm leading-relaxed">Shop: 1, 2 | 12, 13, Level: 6<br />Block: D, Bashundhara City</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter (lg: 3 cols) - Hidden on mobile */}
          <div className="hidden sm:block sm:col-span-2 lg:col-span-3">
            <div className="bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-800">
              <h3 className="text-sm font-semibold mb-2 text-white uppercase tracking-wider">Stay Updated</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-600"
                />
                <button className="absolute right-1 top-1 bottom-1 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-lg w-10 flex items-center justify-center hover:opacity-90 transition-opacity">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-6 pb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm text-center md:text-left">
            © {currentYear} Appleians Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-orange-500 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
