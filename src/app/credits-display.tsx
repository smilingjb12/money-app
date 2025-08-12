import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface CreditsDisplayProps {
  className?: string;
}

export function CreditsDisplay({ className }: CreditsDisplayProps) {
  const creditsAvailable = useQuery(api.users.getAvailableCredits);

  return (
    <Button variant="outline" className={`w-full justify-center ${className || ""}`}>
      {creditsAvailable} Credits
    </Button>
  );
}