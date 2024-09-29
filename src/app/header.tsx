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
import { useSessionId } from "convex-helpers/react/sessions";
import { useAction, useQuery } from "convex/react";
import { GemIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { DarkModeToggle } from "./dark-mode-toggle";

export function Header() {
  const router = useRouter();
  const [sessionId] = useSessionId();
  const creditsAvailable = useQuery(api.users.getAvailableCredits, {
    sessionId: sessionId!,
  });
  const pay = useAction(api.stripe.pay);
  const handleUpgradeClick = async () => {
    const url = await pay();
    router.push(url!);
  };
  return (
    <header className="border-b">
      <div className="container h-16 px-4 mx-auto flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <StackIcon className="size-7" />
          <span className="font-semibold invisible sm:visible">
            Thumb Scorer
          </span>
        </div>

        {/* Desktop menu */}
        <div className="md:visible gap-x-12 items-center invisible">
          <Button asChild variant="ghost" className="text-md">
            <Link href="/create">Create</Link>
          </Button>

          <Button asChild variant="ghost" className="text-md">
            <Link href="/explore">Explore</Link>
          </Button>
        </div>

        <div className="flex items-center gap-4 min-w-[300px] justify-end">
          <div className="flex gap-1">
            <Hint label="Credits Available" side="left">
              <div className="flex gap-1">
                <GemIcon />
                {creditsAvailable}
              </div>
            </Hint>
          </div>
          <DarkModeToggle />
          <SignedIn>
            <Button onClick={handleUpgradeClick}>Upgrade</Button>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>

          {/* Mobile menu */}
          <div className="md:hidden">
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
