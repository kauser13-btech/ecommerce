import Link from 'next/link';

export default function Footer() {
  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/appleians' },
    { name: 'Instagram', href: 'https://www.instagram.com/appleiansbd' },
    { name: 'TikTok', href: 'https://tiktok.com/@appleians' },
  ];

  return (
    <footer className="bg-white pt-20 pb-10 relative overflow-hidden">
      {/* Background Map Pattern (Optional/Simulated) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'0 0 2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-16">
          <Link href="/">
            <img src="/logo.png" alt="Appleians" className="h-24 w-auto mb-2" />
          </Link>
        </div>

        {/* Branch Cards Section */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mb-16">

          {/* Tokyo Square Branch */}
          <div className="relative group w-full max-w-sm">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wider whitespace-nowrap z-20 shadow-lg">
              Tokyo Square Branch
            </div>
            <div className="bg-gradient-to-r from-[#FF512F] to-[#F09819] rounded-2xl p-8 pt-10 text-white text-center shadow-xl transform transition-transform hover:scale-105">
              <div className="space-y-1 text-sm font-medium leading-relaxed">
                <p>SHOP: 616, 643</p>
                <p>LEVEL: 6, TOKYO SQUARE</p>
                <p>JAPAN GARDEN CITY</p>
                <p>MOHAMMADPUR, DHAKA</p>
              </div>
            </div>
          </div>

          {/* Bashundhara Branch */}
          <div className="relative group w-full max-w-sm">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wider whitespace-nowrap z-20 shadow-lg">
              Bashundhara Branch
            </div>
            <div className="bg-gradient-to-r from-[#FF512F] to-[#F09819] rounded-2xl p-8 pt-10 text-white text-center shadow-xl transform transition-transform hover:scale-105">
              <div className="space-y-1 text-sm font-medium leading-relaxed">
                <p>SHOP: 1, 2 | 12, 13</p>
                <p>LEVEL: 6, BLOCK: D,</p>
                <p>BASHUNDHARA CITY SHOPPING MALL</p>
                <p>PANTHAPATH, DHAKA</p>
              </div>
            </div>
          </div>

        </div>

        {/* Hotline Section */}
        <div className="text-center mb-16">
          <a href="tel:01842430000" className="inline-flex items-center gap-3 text-2xl font-bold text-gray-800 hover:text-orange-600 transition-colors">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.49-5.15-3.8-6.62-6.63l1.97-1.57c.26-.29.35-.69.24-1.08-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3.28 3 3.93 3 4.74c0 9.93 8.07 18 18 18 .81 0 1.46-.65 1.46-1.19v-3.72c0-.54-.45-.99-.99-.99z" />
            </svg>
            <span>Hotline : 01842 - 430000</span>
          </a>
        </div>

        {/* Copyright & Socials */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>Copyright © {new Date().getFullYear()} Appleians Inc. All rights reserved.</p>
            <div className="flex gap-6">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition-colors">
                  {link.name}
                </a>
              ))}
              <Link href="/contact-us" className="hover:text-orange-600 transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
