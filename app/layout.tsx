// File: app/(root)/layout.tsx
import type { Metadata } from "next";

import "./globals.css";
import { Poppins } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Header from "@/components/header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Multi Store Admin Portal",
  description: "Managing your store",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const {userId} = auth()

  return (
    <html lang="en">
      <body className={poppins.className}>
        <img src="/images/hero.svg" className="absolute -z-10 right-0 w-full md:w-[60%]" alt=""/>
        <ClerkProvider>
        <Header userId = {userId}/>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
