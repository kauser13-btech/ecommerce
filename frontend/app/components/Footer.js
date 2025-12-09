import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
// unused import removed

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-white pt-20 pb-10 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <img src="/logo.png" alt="Appleians" className="h-12 w-auto brightness-0 invert" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premium destination for authentic Apple products in Bangladesh. experience excellence with every purchase.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/appleians" target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-blue-500 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/appleiansbd" target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-pink-500 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://tiktok.com/@appleians" target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-orange-500 transition-colors"></span>
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?filter=new" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-orange-500 transition-colors"></span>
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/emi-terms" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-orange-500 transition-colors"></span>
                  EMI Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-orange-500 transition-colors"></span>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex flex-shrink-0 items-center justify-center text-orange-500">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Hotline</p>
                  <a href="tel:01842430000" className="text-white hover:text-orange-500 transition-colors font-medium">01842 - 430000</a>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex flex-shrink-0 items-center justify-center text-orange-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Locations</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-orange-500 text-xs font-bold mb-0.5">TOKYO SQUARE BRANCH</p>
                      <p className="text-gray-400 text-xs">Shop: 616, 643 | Level: 6</p>
                      <p className="text-gray-400 text-xs">Japan Garden City, Mohammadpur</p>
                    </div>
                    <div>
                      <p className="text-orange-500 text-xs font-bold mb-0.5">BASHUNDHARA BRANCH</p>
                      <p className="text-gray-400 text-xs">Shop: 1, 2 | 12, 13</p>
                      <p className="text-gray-400 text-xs">Level: 6, Block: D</p>
                      <p className="text-gray-400 text-xs">Bashundhara City, Panthapath</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter/Updates */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-6">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600"
              />
              <button className="absolute right-1 top-1 bottom-1 bg-orange-500 text-white rounded-lg px-3 hover:bg-orange-600 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Appleians Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
