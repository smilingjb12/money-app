"use client";

import { Toaster } from "@/components/ui/toaster";
import * as React from "react";
import { Footer } from "./footer";
import { Header } from "./header";
import { Providers } from "./providers";

interface Props {
  children: React.ReactNode;
}

export default function AppBody({ children }: Props) {
  return (
    <Providers>
      <AppContent>{children}</AppContent>
    </Providers>
  );
}

function AppContent({ children }: Props) {
  React.useEffect(() => {
    // Do something on startup, maybe some day
  }, []);

  return (
    <>
      <Header />
      <main className="flex-grow px-8 mt-8">{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}
