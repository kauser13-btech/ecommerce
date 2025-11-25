import Link from 'next/link';

export default function Footer() {
  const links = {
    'Shop and Learn': ['Mac', 'iPad', 'iPhone', 'Watch', 'AirPods', 'TV & Home', 'AirTag', 'Accessories', 'Gift Cards'],
    'Account': ['Manage Your Apple ID', 'Apple Store Account', 'iCloud.com'],
    'Apple Store': ['Find a Store', 'Genius Bar', 'Today at Apple', 'Apple Camp', 'Apple Store App', 'Certified Refurbished', 'Financing'],
    'Contact Us': [
      { name: 'Tokyo Square Branch', href: '/contact-us' },
      { name: 'Bashundhara Branch', href: '/contact-us' },
      { name: '+8801842-430000', href: 'tel:+8801842430000' },
      { name: 'info@appleians.com', href: 'mailto:info@appleians.com' },
    ]
  };

  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/appleians' },
    { name: 'Instagram', href: 'https://www.instagram.com/appleiansbd' },
    { name: 'TikTok', href: 'https://tiktok.com/@appleians' },
  ];

  return (
    <footer className="bg-[#F5F5F7] text-gray-500 text-xs pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={typeof item === 'string' ? item : item.name}>
                    {typeof item === 'string' ? (
                      <Link href="#" className="hover:underline">
                        {item}
                      </Link>
                    ) : (
                      <Link href={item.href} className="hover:underline">
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>Copyright © {new Date().getFullYear()} Appleians Inc. All rights reserved.</p>
            <div className="flex gap-6">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {link.name}
                </a>
              ))}
              <Link href="/contact-us" className="hover:underline">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
