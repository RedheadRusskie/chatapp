import type { Metadata } from "next";
import SessionProvider from "@/auth/SessionProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../layout/Header/Header";
import MainLayout from "@/layout/MainLayout";

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
        <link rel="icon" href="/icon.ico" sizes="any" />
        <SessionProvider>
          <Header />
          <MainLayout>{children}</MainLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
