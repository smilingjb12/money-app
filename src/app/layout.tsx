import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "./header";
import { Providers } from "./providers";

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
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Header />
          <div className="px-8 mt-8 h-full">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
