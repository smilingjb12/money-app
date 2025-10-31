"use client";

import { useConvexAuth } from "convex/react";
import { useState } from "react";
import { Routes } from "@/lib/routes";
import { AuthButtons } from "./auth-buttons";
import { Logo } from "./logo";
import { MobileMenuToggle } from "./mobile-menu-toggle";
import { MobileNavigation } from "./mobile-navigation";
import { NavigationLinks } from "./navigation-links";
import { UserSection } from "./user-section";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm bg-background/60 backdrop-blur-lg border-b border-border/60">
      <nav className="container max-w-6xl flex h-16 w-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-12">
          <Logo href={isAuthenticated ? Routes.collection() : "/"} />
          <NavigationLinks />
        </div>
        {/* Mobile actions (theme + menu) */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <MobileMenuToggle
            isOpen={isMobileMenuOpen}
            onToggle={toggleMobileMenu}
          />
        </div>
        <div className="hidden md:flex md:items-center gap-4 text-foreground">
          <ThemeToggle />
          {isLoading || isAuthenticated ? (
            <UserSection variant="desktop" />
          ) : (
            <AuthButtons variant="desktop" />
          )}
        </div>
      </nav>
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onToggle={toggleMobileMenu}
      />
    </header>
  );
}
