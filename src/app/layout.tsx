import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InternX50 | 50 Days to Internship Readiness",
  description: "A mission control center for cracking AI/ML internships in 50 days.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] min-h-screen text-white overflow-hidden`}
      >
        <div className="flex h-screen w-full">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050505] to-[#050505] -z-10" />
            <Header />
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 scroll-smooth">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
