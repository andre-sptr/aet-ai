import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; 
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AET AI Assistant",
  description: "Asisten Cerdas Mahasiswa AET PCR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${fontSans.variable} font-sans antialiased bg-gray-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}