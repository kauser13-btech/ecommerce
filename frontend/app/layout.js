import "./globals.css";

import { AuthProvider } from "./context/AuthContext";
import WhatsAppButton from "./components/WhatsAppButton";

export const metadata = {
  title: "Apple Gadgets - Premium Electronics Store",
  description: "Shop the latest Apple products, smartphones, tablets, laptops, and accessories with best prices and EMI options",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
