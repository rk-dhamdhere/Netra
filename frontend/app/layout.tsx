import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NetraFooter from "../components/NetraFooter";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NETRA - National Investigation Intelligence Platform",
  description: "National Crime Records Bureau (NCRB) AI-assisted multi-agency intelligence and investigation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        {children}
        <NetraFooter />
      </body>
    </html>
  );
}
