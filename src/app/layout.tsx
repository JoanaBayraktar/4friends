import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";
import { PointsProvider } from "@/hooks/usePoints";
import { BottomNav } from "@/components/BottomNav";
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
  title: "4Friends",
  description: "Was sehen deine Freund:innen in dir?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-orange-50 text-zinc-900">
        <AuthProvider>
          <PointsProvider>
            <div className="flex flex-1 flex-col pb-16 sm:pb-0">
              {children}
            </div>
            <BottomNav />
          </PointsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
