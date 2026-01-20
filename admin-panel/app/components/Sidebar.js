'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LayoutDashboard, Package, Tag, Ticket, Image as ImageIcon, LogOut, Star, Percent, FolderTree, ShoppingBag, ChevronDown, ChevronRight, Users, Settings, List, Home, FileText } from 'lucide-react';


const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    {
        name: 'Home Display',
        href: '/dashboard/products/new-arrivals',
        icon: Home,
        submenu: [
            { name: 'New Arrivals', href: '/dashboard/products/new-arrivals' },
            { name: 'Featured', href: '/dashboard/products/featured' },
            { name: 'Categories', href: '/dashboard/categories?view=home' },
            { name: 'Brands', href: '/dashboard/brands?view=home' },
        ]
    },
    {
        name: 'Products',
        href: '/dashboard/products',
        icon: Package,
        submenu: [
            { name: 'Add Product', href: '/dashboard/products/new' }
        ]
    },
    { name: 'Categories', href: '/dashboard/categories', icon: FolderTree },
    { name: 'Blogs', href: '/dashboard/blogs', icon: FileText },
    { name: 'Menus', href: '/dashboard/menus', icon: List },
    { name: 'Brands', href: '/dashboard/brands', icon: Star },
    { name: 'Offers', href: '/dashboard/offers', icon: Percent },
    { name: 'Promo Codes', href: '/dashboard/promocodes', icon: Ticket },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Media', href: '/dashboard/media', icon: ImageIcon },
    { name: 'Admins', href: '/dashboard/admins', icon: Users },
    { name: 'Profile', href: '/dashboard/profile', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState(null);
    const [expandedMenus, setExpandedMenus] = useState({});

    // Auto-expand menu if current path matches
    useEffect(() => {
        const newExpanded = { ...expandedMenus };
        let hasChanges = false;

        menuItems.forEach(item => {
            if (item.submenu) {
                if (pathname.startsWith(item.href)) {
                    if (!newExpanded[item.name]) {
                        newExpanded[item.name] = true;
                        hasChanges = true;
                    }
                }
            }
        });

        if (hasChanges) {
            setExpandedMenus(newExpanded);
        }
    }, [pathname]);

    useEffect(() => {
        const userStr = localStorage.getItem('admin_user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.push('/login');
    };

    const toggleMenu = (name) => {
        setExpandedMenus(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    return (
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col fixed left-0 top-0 h-full z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
            <div className="p-6 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Appleians" className="h-24 w-auto" />
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Overview
                </div>
                {menuItems.filter(item => {
                    if (item.name === 'Admins' && user?.role !== 'admin') return false;
                    return true;
                }).map((item) => {
                    const Icon = item.icon;
                    // ... rest of the mapping logic
                    const isActive = pathname === item.href || (item.submenu && pathname.startsWith(item.href) && pathname !== item.href);
                    const isExpanded = expandedMenus[item.name];
                    const hasSubmenu = item.submenu && item.submenu.length > 0;

                    return (
                        <div key={item.name}>
                            {hasSubmenu ? (
                                <button
                                    onClick={() => toggleMenu(item.name)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive || isExpanded
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`h-5 w-5 transition-colors ${isActive || isExpanded ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                        {item.name}
                                    </div>
                                    {isExpanded ? (
                                        <ChevronDown className="h-4 w-4 text-slate-400" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4 text-slate-400" />
                                    )}
                                </button>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                        ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                    {item.name}
                                </Link>
                            )}

                            {/* Submenu Items - logic remains same */}
                            {hasSubmenu && isExpanded && (
                                <div className="mt-1 ml-4 space-y-1 pl-4 border-l-2 border-slate-100">
                                    {item.name !== 'Home Display' && (
                                        <Link href={item.href} className={`block px-3 py-2 rounded-lg text-sm transition-colors ${pathname === item.href && !searchParams.has('featured') ? 'text-indigo-600 font-medium bg-indigo-50/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>All Products</Link>
                                    )}
                                    {item.submenu.map((subItem) => {
                                        // Standardize logic
                                        let isSubActive = false;
                                        if (subItem.href.includes('?')) {
                                            // Extract query param from href (e.g. view=home)
                                            // simplified check: if current URL has the same query param as the link
                                            if (subItem.href.includes('view=home')) {
                                                isSubActive = pathname === subItem.href.split('?')[0] && searchParams.get('view') === 'home';
                                            } else if (subItem.href.includes('featured=true')) { // hypothetical
                                                isSubActive = pathname === subItem.href.split('?')[0] && searchParams.get('featured') === 'true';
                                            }
                                        } else {
                                            // Exact match for path, ensure no conflicting params if needed, 
                                            // but for now simple path match is usually enough unless we have same path with different params.
                                            // For "New Arrivals" which is just a path, exact match is good.
                                            isSubActive = pathname === subItem.href;
                                        }

                                        return (
                                            <Link key={subItem.name} href={subItem.href} className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isSubActive ? 'text-indigo-600 font-medium bg-indigo-50/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>{subItem.name}</Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-3 px-3 py-3 w-full rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 hover:shadow-red-300 transition-all duration-200 group perspective-button"
                >
                    <LogOut className="h-5 w-5 text-red-100 group-hover:text-white transition-colors" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
