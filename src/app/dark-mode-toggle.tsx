"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export function DarkModeToggle() {
  return (
    <Button variant="outline" size="icon" disabled>
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-0 transition-all dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-100 transition-all dark:scale-100" />
      <span className="sr-only">Dark mode enabled</span>
    </Button>
  );
}
