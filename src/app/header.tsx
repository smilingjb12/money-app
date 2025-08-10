"use client";

import { Button } from "@/components/ui/button";
import { Constants } from "@/constants";
import { Routes } from "@/lib/routes";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { LogOutIcon, Menu, PackageIcon, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { AvatarDropdown } from "./avatar-dropdown";

export function Header() {
  const { signIn, signOut } = useAuthActions();
  const user = useQuery(api.users.getCurrentUser);
  const creditsAvailable = useQuery(api.users.getAvailableCredits);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const signInWithGoogle = async () => {
    try {
      await signIn("google");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const CreditsButton = () => {
    return (
      <Button variant="outline" className="w-full justify-center">
        {creditsAvailable} Credits
      </Button>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-md bg-background/60 backdrop-blur-lg border-b border-accent/50">
      <nav className="container flex h-16 w-full items-center justify-between px-4 md:px-6 lg:px-20">
        <div className="flex items-center gap-12">
          <Authenticated>
            <Link
              href={Routes.collection()}
              className="flex items-center gap-2 group hover:text-primary transition-colors duration-100"
            >
              <PackageIcon className="size-7" />
              <span className="text-base font-semibold sm:text-lg md:text-xl lg:text-xl group-hover:text-primary">
                {Constants.APP_NAME}
              </span>
            </Link>
          </Authenticated>
          <Unauthenticated>
            <Link
              href="/"
              className="flex items-center gap-2 group hover:text-primary transition-colors duration-100"
            >
              <PackageIcon className="size-7" />
              <span className="text-base font-semibold sm:text-lg md:text-xl lg:text-xl group-hover:text-primary">
                {Constants.APP_NAME}
              </span>
            </Link>
          </Unauthenticated>
          <div className="hidden md:flex md:items-center md:ml-20 lg:ml-20">
            <div className="flex items-center md:gap-6 lg:gap-12 text-sm sm:text-base md:text-lg lg:text-lg font-medium">
              <Authenticated>
                <Link
                  href={Routes.collection()}
                  className="hover:text-primary text-foreground transition-colors duration-100"
                >
                  Collection
                </Link>
                <Link
                  href={Routes.create()}
                  className="hover:text-primary text-foreground transition-colors duration-100"
                >
                  Create
                </Link>
              </Authenticated>
            </div>
          </div>
        </div>
        <Button
          className="md:hidden"
          variant="ghost"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
        <div className="hidden md:flex md:items-center gap-4 text-foreground">
          <Authenticated>
            <CreditsButton />
            <AvatarDropdown
              fullName={user?.name || ""}
              imageUrl={user?.image || ""}
              email={user?.email || ""}
            />
          </Authenticated>
          <Unauthenticated>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => void signInWithGoogle()}>
                Sign In
              </Button>
              <Button onClick={() => void signInWithGoogle()}>Sign Up</Button>
            </div>
          </Unauthenticated>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/80 backdrop-blur-lg py-4 px-6">
          <div className="flex flex-col gap-4 items-center w-full">
            <Authenticated>
              <Button variant="ghost" asChild>
                <Link
                  href={Routes.collection()}
                  className="hover:text-primary text-foreground w-full"
                  onClick={toggleMobileMenu}
                >
                  Collection
                </Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link
                  href={Routes.create()}
                  className="hover:text-primary text-foreground w-full"
                  onClick={toggleMobileMenu}
                >
                  Create
                </Link>
              </Button>

              <CreditsButton />

              <Button
                variant="ghost"
                className="hover:bg-transparent/20 justify-center w-full"
                onClick={async () => {
                  await signOut();
                  toggleMobileMenu();
                }}
              >
                <LogOutIcon className="mr-2" />
                Sign Out
              </Button>
            </Authenticated>
            <Unauthenticated>
              <div className="flex flex-col gap-2 w-full">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => {
                    void signInWithGoogle();
                    toggleMobileMenu();
                  }}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full justify-center"
                  onClick={() => {
                    void signInWithGoogle();
                    toggleMobileMenu();
                  }}
                >
                  Sign Up
                </Button>
              </div>
            </Unauthenticated>
          </div>
        </div>
      )}
    </header>
  );
}
