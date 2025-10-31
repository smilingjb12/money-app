import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Routes } from "@/lib/routes";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { api } from "../../convex/_generated/api";
import { AvatarDropdown } from "./avatar-dropdown";
import { CreditsDisplay } from "./credits-display";

interface UserSectionProps {
  variant?: "desktop" | "mobile";
  onToggleMenu?: () => void;
}

export function UserSection({ variant = "desktop", onToggleMenu }: UserSectionProps) {
  const { signOut } = useAuthActions();
  const { isLoading } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser);

  const handleSignOut = async () => {
    await signOut();
    if (onToggleMenu) {
      onToggleMenu();
    }
  };

  if (isLoading) {
    if (variant === "mobile") {
      return (
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-26" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <>
        <Button variant="ghost" asChild>
          <Link
            href={Routes.collection()}
            className="hover:text-primary text-foreground w-full"
            onClick={onToggleMenu}
          >
            Collection
          </Link>
        </Button>

        <Button variant="ghost" asChild>
          <Link
            href={Routes.create()}
            className="hover:text-primary text-foreground w-full"
            onClick={onToggleMenu}
          >
            Create
          </Link>
        </Button>

        <CreditsDisplay />

        <Button
          variant="ghost"
          className="hover:bg-transparent/20 justify-center w-full"
          onClick={handleSignOut}
        >
          <LogOutIcon className="mr-2" />
          Sign Out
        </Button>
      </>
    );
  }

  return (
    <>
      <CreditsDisplay />
      <AvatarDropdown
        fullName={user?.name || ""}
        imageUrl={user?.image || ""}
        email={user?.email || ""}
      />
    </>
  );
}
