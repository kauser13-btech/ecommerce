import "./globals.css";

import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import AuthModal from '@/components/AuthModal';
import CartModal from '@/components/CartModal';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://appleians.com'),
  title: {
    template: '%s | Appleians',
    default: "Appleians - Premium Electronics Store",
  },
  description: "Shop the latest Apple products, smartphones, tablets, laptops, and accessories with best prices and EMI options",
  openGraph: {
    title: 'Appleians - Premium Electronics Store',
    description: 'Shop the latest Apple products, smartphones, tablets, laptops, and accessories with best prices and EMI options',
    url: '/',
    siteName: 'Appleians',
    locale: 'en_US',
    type: 'website',
  },
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <WhatsAppButton />
            <AuthModal />
            <CartModal />
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
