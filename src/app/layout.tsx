import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";

export const metadata: Metadata = {
  title: "Portal pily",
  description: "Porez dreva, suseni, palivo a ostreni pilovych kotouco.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className="min-h-screen antialiased" style={{ fontFamily: "var(--font-body)", background: "var(--c-cream)", color: "var(--c-text)" }}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
