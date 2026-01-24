'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LayoutDashboard, Package, Tag, Ticket, Image as ImageIcon, LogOut, Star, Percent, FolderTree, ShoppingBag, ChevronDown, ChevronRight, Users, Settings, List, Home, FileText, Clock } from 'lucide-react';


const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    {
        name: 'Home Page',
        icon: Home,
        submenu: [
            { name: 'New Arrivals', href: '/dashboard/products/new-arrivals' },
            { name: 'Featured Sort', href: '/dashboard/products/featured' },
            { name: 'Categories Sort', href: '/dashboard/categories?view=home' },
            { name: 'Brands Sort', href: '/dashboard/brands?view=home' },
        ]
    },
    {
        name: 'Products',
        icon: Package,
        submenu: [
            { name: 'All Products', href: '/dashboard/products' },
            { name: 'Add Product', href: '/dashboard/products/new' }
        ]
    },

    { "separator": true },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Pre-Orders', href: '/dashboard/pre-orders', icon: Clock },

    { "separator": true },
    { name: 'Offers', href: '/dashboard/offers', icon: Percent },
    { name: 'Blogs', href: '/dashboard/blogs', icon: FileText },
    { name: 'Tags', href: '/dashboard/tags', icon: Tag },

    { "separator": true },
    {
        name: 'Admins Menu',
        href: '/dashboard/admins',
        icon: Users,
        submenu: [
            { name: 'Categories', href: '/dashboard/categories', icon: FolderTree },
            { name: 'Menus', href: '/dashboard/menus', icon: List },
            { name: 'Brands', href: '/dashboard/brands', icon: Star },
            { name: 'Media', href: '/dashboard/media', icon: ImageIcon },
            { name: 'Promo Codes', href: '/dashboard/promocodes', icon: Ticket },
            { name: 'Admins', href: '/dashboard/admins', icon: Users }
        ]
    }
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState(null);
    const [expandedMenus, setExpandedMenus] = useState({});


    useEffect(() => {
        let activeMenu = null;
        let maxLen = 0;

        menuItems.forEach(item => {
            if (item.submenu) {
                if (pathname.startsWith(item.href)) {

                    if (item.href.length > maxLen) {
                        maxLen = item.href.length;
                        activeMenu = item.name;
                    }
                }
            }
        });

        if (activeMenu) {
            setExpandedMenus({ [activeMenu]: true });
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
        setExpandedMenus(prev => {
            if (prev[name]) {
                return { ...prev, [name]: false };
            }
            return { [name]: true };
        });
    };

    return (
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col fixed left-0 top-0 h-full z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
            <div className="p-2 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Appleians" className="h-18 w-auto" />
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {menuItems.filter(item => {
                    if (item.name === 'Admins' && user?.role !== 'admin') return false;
                    return true;
                }).map((item, index) => {
                    if (item.separator) {
                        return <div key={index} className="my-4 border-t border-slate-100" />;
                    }
                    const Icon = item.icon;

                    let isActive = pathname === item.href || (item.submenu && pathname.startsWith(item.href) && pathname !== item.href);

                    const isExpanded = expandedMenus[item.name];
                    const hasSubmenu = item.submenu && item.submenu.length > 0;

                    return (
                        <div key={item.name || index}>
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
                                    onClick={() => setExpandedMenus({})}
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
                                    {item.submenu.map((subItem) => {
                                        let isSubActive = false;
                                        const SubIcon = subItem.icon || null;

                                        if (subItem.href.includes('?')) {
                                            if (subItem.href.includes('view=home')) {
                                                isSubActive = pathname === subItem.href.split('?')[0] && searchParams.get('view') === 'home';
                                            } else if (subItem.href.includes('featured=true')) {
                                                isSubActive = pathname === subItem.href.split('?')[0] && searchParams.get('featured') === 'true';
                                            }
                                        } else {
                                            isSubActive = pathname === subItem.href;
                                        }

                                        return (
                                            <div key={subItem.name} className="flex items-center">
                                                {SubIcon && <SubIcon className={`ml-2 h-5 w-5 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />}

                                                < Link href={subItem.href} className={`px-3 py-2 rounded-lg text-sm transition-colors ${isSubActive ? 'text-indigo-600 font-medium bg-indigo-50/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`
                                                }> {subItem.name}</Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav >

            <div className="px-4 py-2 flex flex-row gap-2 bg-slate-50">
                <Link
                    href="/dashboard/profile"
                    className=" border border-slate-400 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 group"
                >
                    <Settings className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full border border-slate-400 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
                >
                    <LogOut className="h-5 w-5 text-red-400 group-hover:text-red-600 transition-colors" />
                    Logout
                </button>
            </div>
        </aside >
    );
}
