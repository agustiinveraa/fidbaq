import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ToastContainer from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";

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
    icon: '/1.png',
    shortcut: '/1.png',
    apple: '/1.png',
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
        <ToastContainer />
        <ConfirmModal />
      </body>
    </html>
  );
}
