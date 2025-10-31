import { Button } from "@/components/ui/button";
import { Routes } from "@/lib/routes";
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "../../convex/_generated/api";

interface CreditsDisplayProps {
  className?: string;
}

export function CreditsDisplay({ className }: CreditsDisplayProps) {
  const creditsAvailable = useQuery(api.users.getAvailableCredits);

  return (
    <Button
      variant="outline"
      asChild
      className={`w-full justify-center ${className || ""}`}
    >
      <Link href={Routes.upgrade()}>
        {creditsAvailable} Credits
      </Link>
    </Button>
  );
}
