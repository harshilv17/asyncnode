import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne, Space_Grotesk } from "next/font/google";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { Toaster } from "sonner";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AsyncNodes",
  description: "AI Workflow Automation Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0B0B0C] text-[#FAFAFA]">
        <LenisProvider />
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}