'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

import CartIcon from "@/assets/icons/cart.svg";
import UserIcon from "@/assets/icons/user.svg";
import SearchIcon from "@/assets/icons/search.svg";
import FacebookIcon from "@/assets/icons/facebook.svg";
import InstagramIcon from "@/assets/icons/instagram.svg";
import TiktokIcon from "@/assets/icons/tiktok.svg";
import PhoneIcon from "@/assets/icons/phone.svg";
import { ChevronDown } from 'lucide-react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState({ data: [], suggestions: [] });
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, openLoginModal } = useAuth();
  const { getCartCount, toggleCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          const response = await api.get(`/products/search?q=${searchQuery}`);
          setSearchResults(response.data);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({ data: [], suggestions: [] });
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      setIsSearchOpen(false);
    }
  };

  const [menus, setMenus] = useState([]);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await api.get('/menu');
        setMenus(response.data);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
        // Fallback could go here if needed
      }
    }
    fetchMenu();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-200 h-20 shadow-xl' : 'bg-white h-auto border-b border-gray-100'
        }`}
    >
      {/* Topbar */}
      <div className={`bg-gray-50 text-gray-600 transition-all duration-300 overflow-hidden border-b border-gray-100 ${isScrolled ? 'max-h-0' : 'max-h-10 py-2'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs">
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/appleians" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/appleiansbd" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href="https://tiktok.com/@appleians" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
              <TiktokIcon className="w-4 h-4" />
            </a>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <PhoneIcon className="w-3 h-3" />
            <a href="tel:01842430000" className="hover:text-orange-500 transition-colors">Hotline : 01842430000</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-20">
        <div className="flex items-center justify-between h-full">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -ml-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="Appleians"
              className={`w-auto transition-all duration-300 ${isScrolled ? 'h-10' : 'h-16'}`}
            />
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex gap-8">
            {menus.map((link) => (
              <div key={link.id} className="relative group h-full flex items-center">
                <Link
                  href={link.url || '#'}
                  className="text-sm font-bold text-gray-800 hover:text-orange-600 transition-all duration-300 py-2 flex items-center gap-1 uppercase tracking-wide relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-600 after:transition-all after:duration-300 group-hover:after:w-full"
                >
                  {link.title}
                  {link.children && link.children.length > 0 && (
                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                  )}
                </Link>

                {/* Submenu */}
                {link.children && link.children.length > 0 && (
                  <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-b-xl border-t-2 border-orange-500 py-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col p-1">
                      {link.children.map((subLink) => (
                        <Link
                          key={subLink.id}
                          href={subLink.url || '#'}
                          className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                        >
                          {subLink.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search Component */}
            <div className="relative hidden sm:block" ref={searchRef}>
              <div className={`flex items-center transition-all duration-300 bg-gray-100 rounded-full ${isSearchOpen ? 'w-64' : 'w-10 h-10 bg-transparent'}`}>
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-4 pr-8 py-2 text-sm bg-transparent border-none focus:ring-0 rounded-full"
                      autoFocus
                    />
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <SearchIcon className="w-6 h-6 text-gray-700 hover:text-black overflow-visible" />
                  </button>
                )}

                {isSearchOpen && (
                  <button
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && searchQuery.length > 1 && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2 z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      Searching...
                    </div>
                  ) : (
                    <>
                      {searchResults.data && searchResults.data.length > 0 ? (
                        <>
                          <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Products</div>
                          {searchResults.data.map(product => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                {product.image ? (
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">IMG</div>
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</div>
                                <div className="text-xs text-gray-500">{product.brand?.name || 'Apple'}</div>
                              </div>
                            </Link>
                          ))}
                        </>
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <p className="text-sm text-gray-500">No results for "{searchQuery}"</p>
                        </div>
                      )}

                      {/* Suggestions */}
                      {searchResults.suggestions && searchResults.suggestions.length > 0 && (
                        <div className="border-t border-gray-100 mt-2 bg-gray-50/50">
                          <div className="px-4 py-3 text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
                            <SearchIcon className="w-3 h-3" />
                            You might like
                          </div>
                          {searchResults.suggestions.map(product => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-white transition-colors group"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              <div className="w-8 h-8 rounded-md bg-gray-200 overflow-hidden flex-shrink-0">
                                {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
                              </div>
                              <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-1">{product.name}</div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={toggleCart}
              className="flex justify-center items-center p-1 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <CartIcon className="w-6 h-6 text-gray-700 hover:text-black overflow-visible" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {getCartCount()}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative group hidden sm:block">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-black py-2">
                  <UserIcon className="w-6 h-6 text-gray-700 hover:text-black overflow-visible" />
                </button>
                <div className="absolute right-0 mt-0 w-56 bg-white rounded-xl shadow-xl py-2 hidden group-hover:block border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 mb-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/my-orders"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="text-sm font-medium text-gray-700 hover:text-black hidden sm:block"
              >
                <UserIcon className="w-6 h-6 text-gray-700 hover:text-black overflow-visible" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg py-4 px-4 flex flex-col gap-4">
          {menus.map((link) => (
            <div key={link.id}>
              <Link
                href={link.url || '#'}
                className="text-base font-medium text-gray-700 hover:text-black py-2 border-b border-gray-100 last:border-0 block"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.title}
              </Link>
              {/* Mobile Submenu - simplified for now */}
              {link.children && link.children.length > 0 && (
                <div className="pl-4 mt-2 border-l-2 border-gray-100">
                  {link.children.map(subLink => (
                    <Link
                      key={subLink.id}
                      href={subLink.url || '#'}
                      className="block text-sm text-gray-500 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {subLink.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-2 flex flex-col gap-3">
            {user ? (
              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="text-left text-base font-medium text-red-600"
              >
                Sign out ({user.name})
              </button>
            ) : (
              <button
                onClick={() => { openLoginModal(); setIsMenuOpen(false); }}
                className="text-left text-base font-medium text-blue-600"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
