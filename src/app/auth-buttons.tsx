import { Button } from "@/components/ui/button";
import { Routes } from "@/lib/routes";
import { useAuthActions } from "@convex-dev/auth/react";

interface AuthButtonsProps {
  variant?: "desktop" | "mobile";
  onToggleMenu?: () => void;
}

export function AuthButtons({
  variant = "desktop",
  onToggleMenu,
}: AuthButtonsProps) {
  const { signIn } = useAuthActions();

  const handleSignIn = async () => {
    try {
      await signIn("google", { redirectTo: Routes.dashboard() });
      if (onToggleMenu) {
        onToggleMenu();
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  if (variant === "mobile") {
    return (
      <Button className="w-full justify-center" onClick={handleSignIn}>
        Sign In
      </Button>
    );
  }

  return <Button onClick={handleSignIn}>Sign In</Button>;
}
