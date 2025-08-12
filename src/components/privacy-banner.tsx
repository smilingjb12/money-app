"use client";

import { Button } from "@/components/ui/button";
import { Routes } from "@/lib/routes";
import { Cookie } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const CONSENT_KEY = "flowspace-cookie-consent";
const CONSENT_VERSION = "1.0";

interface ConsentData {
  accepted: boolean;
  version: string;
  timestamp: number;
}

export function PrivacyBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname();

  // Check if current route is public
  const isPublicRoute = pathname === "/" || pathname.startsWith("/legal/");

  useEffect(() => {
    // Only show on public routes
    if (!isPublicRoute) {
      setIsLoaded(true);
      return;
    }

    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        const consent = JSON.parse(stored) as ConsentData;
        // Show banner if no consent or outdated version
        setShowBanner(!consent.accepted || consent.version !== CONSENT_VERSION);
      } else {
        setShowBanner(true);
      }
    } catch {
      // If localStorage fails, show banner
      setShowBanner(true);
    }
    setIsLoaded(true);
  }, [isPublicRoute]);

  const handleAccept = () => {
    try {
      const consent: ConsentData = {
        accepted: true,
        version: CONSENT_VERSION,
        timestamp: Date.now(),
      };
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
      setShowBanner(false);
    } catch {
      // If localStorage fails, still hide banner
      setShowBanner(false);
    }
  };

  // Don't render anything until we've checked localStorage
  if (!isLoaded || !showBanner || !isPublicRoute) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Cookie className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-foreground">
              We use cookies to enhance your experience.{" "}
              <Link
                href={Routes.privacyPolicy()}
                className="text-primary-foreground underline hover:no-underline font-medium"
              >
                Learn more
              </Link>
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleAccept}
            className="text-xs px-4 py-2 h-8 flex-shrink-0"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
