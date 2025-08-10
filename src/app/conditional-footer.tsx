"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on protected routes (routes that start with /collection, /upgrade, or /create)
  const isProtectedRoute = pathname.startsWith('/collection') || pathname.startsWith('/upgrade') || pathname.startsWith('/create');
  
  if (isProtectedRoute) {
    return null;
  }
  
  return <Footer />;
}