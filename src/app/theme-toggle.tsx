"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useCallback, useMemo } from "react";

type ThemeValue = "light" | "dark";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const value: ThemeValue = useMemo(() => {
    return theme === "dark" ? "dark" : "light";
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(value === "dark" ? "light" : "dark");
  }, [setTheme, value]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      aria-label={`Switch to ${value === "dark" ? "light" : "dark"} theme`}
      aria-pressed={value === "dark"}
      className={className}
    >
      {value === "dark" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">
        Switch to {value === "dark" ? "light" : "dark"} theme
      </span>
    </Button>
  );
}
