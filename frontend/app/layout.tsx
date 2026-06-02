import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'sonner';
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Restify",
  description: "Hotel Booking Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          input::-ms-reveal {
            display: none !important;
          }
          input::-ms-clear {
            display: none !important;
          }
          ::-ms-reveal {
            display: none !important;
          }
          ::-ms-clear {
            display: none !important;
          }
        `}} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-center" />
        </AuthProvider>
        <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={'Mid-client-XxTfLCZ76GoQZj3Z'} strategy="beforeInteractive" />
      </body>
    </html>
  );
}
