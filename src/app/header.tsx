"use client";

import { Button } from "@/components/ui/button";
import { useClerk, useSignIn } from "@clerk/nextjs";
import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useQuery,
} from "convex/react";
import { LogOutIcon, Menu, PackageIcon, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

export function Header() {
  const { isAuthenticated } = useConvexAuth();
  const creditsAvailable = useQuery(api.users.getAvailableCredits);
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const signInWithGoogle = async () => {
    await signIn?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/",
      redirectUrlComplete: "/",
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-md bg-secondary">
      <nav className="container flex h-20 w-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center gap-2 group hover:text-primary"
          >
            <PackageIcon className="size-8" />
            <span className="text-base font-semibold sm:text-lg md:text-xl lg:text-2xl group-hover:text-primary">
              ThumbScorer
            </span>
          </Link>
          <div className="hidden md:flex md:items-center ml-8">
            <div className="flex items-center md:gap-6 lg:gap-12 text-sm sm:text-base md:text-lg lg:text-lg font-medium">
              <Link
                href="/explore"
                className="hover:text-primary text-foreground"
              >
                Explore
              </Link>
              <Link
                href="/create"
                className="hover:text-primary text-foreground"
              >
                Create
              </Link>
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
          {isAuthenticated && (
            <Button variant="outline">{creditsAvailable} Credits</Button>
          )}
          <Authenticated>
            <Button
              variant="ghost"
              className="hover:bg-transparent/20 justify-center w-full"
              onClick={() => {
                clerk.signOut();
              }}
            >
              <LogOutIcon className="mr-2" />
              Sign Out
            </Button>
          </Authenticated>
          <Unauthenticated>
            <Button variant="default" onClick={signInWithGoogle}>
              Sign In
            </Button>
          </Unauthenticated>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-secondary py-4 px-6">
          <div className="flex flex-col gap-4 items-center w-full">
            <Button variant="ghost" asChild>
              <Link
                href="/explore"
                className="hover:text-primary text-foreground w-full"
                onClick={toggleMobileMenu}
              >
                Explore
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link
                href="/create"
                className="hover:text-primary text-foreground w-full"
                onClick={toggleMobileMenu}
              >
                Create
              </Link>
            </Button>

            {isAuthenticated && (
              <Button variant="outline" className="w-full justify-center">
                {creditsAvailable} Credits
              </Button>
            )}
            <Authenticated>
              <Button
                variant="ghost"
                className="hover:bg-transparent/20 justify-center w-full"
                onClick={() => {
                  clerk.signOut();
                  toggleMobileMenu();
                }}
              >
                <LogOutIcon className="mr-2" />
                Sign Out
              </Button>
            </Authenticated>
            <Unauthenticated>
              <Button
                variant="default"
                className="w-full justify-center"
                onClick={signInWithGoogle}
              >
                Sign In
              </Button>
            </Unauthenticated>
          </div>
        </div>
      )}
    </header>
  );
}
