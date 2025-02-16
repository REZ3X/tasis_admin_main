import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AdminLoader from "@/components/feature/loader";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TASIS Admin",
  description: "Admin panel for TASIS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        <AuthProvider>
          <AdminLoader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}