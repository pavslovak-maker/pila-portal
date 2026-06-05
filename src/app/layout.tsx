import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portal pily",
  description: "Porez dreva, suseni, palivo a ostreni pilovych kotouco.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const bodyClass = geistSans.variable + " " + geistMono.variable + " min-h-screen antialiased";
  return (
    <html lang="cs">
      <body className={bodyClass}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
