'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('admin_token');
            const isLoginPage = pathname === '/login';

            if (!token) {
                if (!isLoginPage) {
                    router.push('/login');
                } else {
                    setAuthorized(true);
                }
            } else {
                // If logged in and trying to access login page, redirect to dashboard
                if (isLoginPage) {
                    router.push('/dashboard');
                } else {
                    setAuthorized(true);
                }
            }
        };

        checkAuth();
    }, [pathname, router]);

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return <>{children}</>;
}
