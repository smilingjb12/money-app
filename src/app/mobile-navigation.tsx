import { useConvexAuth } from "convex/react";
import { AuthButtons } from "./auth-buttons";
import { UserSection } from "./user-section";

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileNavigation({ isOpen, onToggle }: MobileNavigationProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-background/80 backdrop-blur-lg py-4 px-6">
      <div className="flex flex-col gap-4 items-center w-full">
        {isLoading || isAuthenticated ? (
          <UserSection
            variant="mobile"
            onToggleMenu={onToggle}
          />
        ) : (
          <AuthButtons
            variant="mobile"
            onToggleMenu={onToggle}
          />
        )}
      </div>
    </div>
  );
}