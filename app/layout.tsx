// File: app/(root)/layout.tsx
import type { Metadata } from "next";

import "./globals.css";
import { Poppins } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Header from "@/components/header";
import Footer from "@/components/footer";
import ToastProvider from "@/providers/toast-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Thuc duong Store",
  description: "Managing your store",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <body className={poppins.className}>
        <ToastProvider/>
        <img src="/images/hero.svg" className="absolute -z-10 right-0 w-full md:w-[60%]" alt=""/>
        <ClerkProvider>
          <Header />
          {children}
        </ClerkProvider>
        <Footer/>
      </body>
    </html>
  );
}
