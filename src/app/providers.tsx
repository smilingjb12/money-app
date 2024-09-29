"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { SessionProvider } from "convex-helpers/react/sessions";
import { useLocalStorage } from "usehooks-ts";
import { useTheme } from "next-themes";
import { dark, neobrutalism } from "@clerk/themes";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const ThemedClerkProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{ baseTheme: theme === "dark" ? dark : neobrutalism }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      {children}
    </ClerkProvider>
  );
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemedClerkProvider>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <SessionProvider
            useStorage={useLocalStorage}
            storageKey={process.env.SESSION_LOCAL_STORAGE_KEY}
          >
            {children}
          </SessionProvider>
        </ConvexProviderWithClerk>
      </ThemedClerkProvider>
    </ThemeProvider>
  );
};
