"use client";

import { Toaster } from "@/components/ui/toaster";
import { useSessionMutation } from "convex-helpers/react/sessions";
import * as React from "react";
import { api } from "../../convex/_generated/api";
import { Footer } from "./footer";
import { Header } from "./header";
import { Providers } from "./providers";

interface Props {
  children: React.ReactNode;
}

export default function AppBody({ children }: Props) {
  return (
    <Providers>
      <AppContent>{children}</AppContent>
    </Providers>
  );
}

function AppContent({ children }: Props) {
  const createAnonymousUser = useSessionMutation(
    api.users.createAnonymousUserOnStartup
  );

  React.useEffect(() => {
    createAnonymousUser(); // maybe handle error?
  }, [createAnonymousUser]);

  return (
    <>
      <Header />
      <main className="flex-grow px-8 mt-8">{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}
