import "./globals.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import WhatsAppButton from "./components/WhatsAppButton";
import AuthModal from './components/AuthModal';
import CartModal from './components/CartModal';

export const metadata = {
  title: "Appleians - Premium Electronics Store",
  description: "Shop the latest Apple products, smartphones, tablets, laptops, and accessories with best prices and EMI options",
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
