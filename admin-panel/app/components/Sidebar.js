'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Tag, Ticket, Image as ImageIcon, LogOut, Star, Percent, FolderTree, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';


const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Categories', href: '/dashboard/categories', icon: FolderTree },
    { name: 'Brands', href: '/dashboard/brands', icon: Star },
    { name: 'Offers', href: '/dashboard/offers', icon: Percent },
    { name: 'Promo Codes', href: '/dashboard/promocodes', icon: Ticket },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Media', href: '/dashboard/media', icon: ImageIcon },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.push('/login');
    };

    return (
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col fixed left-0 top-0 h-full z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
            <div className="p-6 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Appleians" className="h-24 w-auto" />
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
                <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Overview
                </div>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
                >
                    <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
