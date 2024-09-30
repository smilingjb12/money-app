import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "./header";
import { Providers } from "./providers";
import { Footer } from "./footer";

export const metadata: Metadata = {
  title: "Thumb Scorer",
  description: "Score your thumbnails",
};

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.className} antialiased flex flex-col min-h-screen mt-[60px]`}
      >
        <Providers>
          <Header />
          <main className="flex-grow px-8 mt-8">{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
