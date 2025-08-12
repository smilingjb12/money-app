import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileMenuToggle({ isOpen, onToggle }: MobileMenuToggleProps) {
  return (
    <Button
      className="md:hidden"
      variant="ghost"
      onClick={onToggle}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </Button>
  );
}