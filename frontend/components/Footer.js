import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
// unused import removed

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 text-gray-600 pt-20 pb-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <img src="/logo.png" alt="Appleians" className="h-12 w-auto" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your premium destination for authentic Apple products in Bangladesh. experience excellence with every purchase.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/appleians" target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all text-gray-400">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/appleiansbd" target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-pink-50 hover:text-pink-600 transition-all text-gray-400">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://tiktok.com/@appleians" target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:text-black transition-all text-gray-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/products" className="text-gray-500 hover:text-orange-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-orange-500 transition-colors"></span>
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-gray-500 hover:text-orange-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-orange-500 transition-colors"></span>
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/products?filter=new" className="text-gray-500 hover:text-orange-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-orange-500 transition-colors"></span>
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/emi-terms" className="text-gray-500 hover:text-orange-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-orange-500 transition-colors"></span>
                  EMI Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-orange-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-orange-500 transition-colors"></span>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900">Contact Us</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex flex-shrink-0 items-center justify-center text-orange-500">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Hotline</p>
                  <a href="tel:01842430000" className="text-gray-900 hover:text-orange-500 transition-colors font-medium">01842 - 430000</a>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex flex-shrink-0 items-center justify-center text-orange-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Locations</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-900 text-xs font-bold mb-0.5">TOKYO SQUARE BRANCH</p>
                      <p className="text-gray-500 text-xs">Shop: 616, 643 | Level: 6</p>
                      <p className="text-gray-500 text-xs">Japan Garden City, Mohammadpur</p>
                    </div>
                    <div>
                      <p className="text-gray-900 text-xs font-bold mb-0.5">BASHUNDHARA BRANCH</p>
                      <p className="text-gray-500 text-xs">Shop: 1, 2 | 12, 13</p>
                      <p className="text-gray-500 text-xs">Level: 6, Block: D</p>
                      <p className="text-gray-500 text-xs">Bashundhara City, Panthapath</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter/Updates */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-2 text-gray-900">Stay Updated</h3>
            <p className="text-gray-500 text-sm mb-6">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-900 focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-400"
              />
              <button className="absolute right-1 top-1 bottom-1 bg-orange-500 text-white rounded-lg px-3 hover:bg-orange-600 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} Appleians Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-orange-600 transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-orange-600 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
