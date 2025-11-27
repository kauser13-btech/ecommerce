import "./globals.css";

import { AuthProvider } from "./context/AuthContext";
import WhatsAppButton from "./components/WhatsAppButton";
import AuthModal from './components/AuthModal';

export const metadata = {
  title: "Appleians - Premium Electronics Store",
  description: "Shop the latest Apple products, smartphones, tablets, laptops, and accessories with best prices and EMI options",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
          <WhatsAppButton />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
