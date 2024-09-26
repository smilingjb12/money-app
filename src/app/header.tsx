"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { StackIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header className="border-b">
      <div className="container h-16 px-4 mx-auto flex justify-between items-center">
        <div className="gap-x-12 flex flex-row items-center">
          <div className="flex items-center gap-2">
            <StackIcon className="size-7" />
            <span className="font-semibold">Thumb Scorer</span>
          </div>
          <div>
            <SignedIn>
              <Link href="/create">Create Test</Link>
            </SignedIn>
            <SignedOut>
              <Link href="/">About</Link>
            </SignedOut>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
