import type { Metadata } from "next";
import SessionProvider from "@/app/lib/auth/SessionProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "./layout/MainLayout";
import Header from "./layout/Header/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyChat",
  description: "A personal realtime messenger project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Header />
          <MainLayout>{children}</MainLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
