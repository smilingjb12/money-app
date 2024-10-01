"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { HamburgerMenuIcon, StackIcon } from "@radix-ui/react-icons";
import { useSessionQuery } from "convex-helpers/react/sessions";
import { useAction } from "convex/react";
import { GemIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";

export function Header() {
  const router = useRouter();
  const creditsAvailable = useSessionQuery(api.users.getAvailableCredits);
  const pay = useAction(api.stripe.pay);
  const handleUpgradeClick = async () => {
    const url = await pay();
    router.push(url!);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container h-16 px-4 mx-auto flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <StackIcon className="min-w-[28px] min-h-[28px]" />
          <span className="font-semibold max-sm:hidden sm:inline">
            Thumb Scorer
          </span>
        </div>

        {/* Desktop menu */}
        <div className="max-sm:hidden md:flex gap-x-2 items-center">
          <Button asChild variant="ghost" className="text-md">
            <Link href="/create">Create</Link>
          </Button>
          <Button asChild variant="ghost" className="text-md">
            <Link href="/explore">Explore</Link>
          </Button>
        </div>

        <div className="flex items-center gap-4 justify-end">
          <div className="flex gap-1">
            <Hint label="Credits Available" side="left">
              <div className="flex gap-1">
                <GemIcon />
                {creditsAvailable ?? "-"}
              </div>
            </Hint>
          </div>
          <div className="max-sm:hidden sm:flex items-center justify-center gap-x-4">
            <SignedIn>
              <Button onClick={handleUpgradeClick}>Upgrade</Button>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>

          {/* Mobile menu */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HamburgerMenuIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/explore">Explore</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/create">Create</Link>
                </DropdownMenuItem>
                <SignedIn>
                  <DropdownMenuItem onClick={handleUpgradeClick}>
                    Upgrade
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserButton />
                  </DropdownMenuItem>
                </SignedIn>
                <SignedOut>
                  <DropdownMenuItem>
                    <SignInButton />
                  </DropdownMenuItem>
                </SignedOut>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
