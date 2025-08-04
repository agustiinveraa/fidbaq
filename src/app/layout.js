import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ToastContainer from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fidbaq - Build features your users actually need",
  description: "Fidbaq helps you collect, organize, and act on user feedback — so you can focus on building features that matter. Start for free!",
  icons: {
    icon: '/fidbaq.png',
    shortcut: '/fidbaq.png',
    apple: '/fidbaq.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
        <ToastContainer />
        <ConfirmModal />
      </body>
    </html>
  );
}
