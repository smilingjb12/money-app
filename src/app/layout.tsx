import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppBody from "./app-body";
import "./globals.css";

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
        className={`${inter.className} antialiased flex flex-col mt-[60px]`}
      >
        <AppBody>{children}</AppBody>
      </body>
    </html>
  );
}
