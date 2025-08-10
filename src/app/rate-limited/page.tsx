import { Constants } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rate Limited - Please Wait",
  description: "Too many requests detected. Please wait a few minutes before trying again.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RateLimitedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full mx-auto max-w-2xl pt-24 text-center">
      <div className="text-6xl font-bold text-destructive mb-6">429</div>
      <h1 className="text-2xl font-semibold text-foreground mb-4">Rate Limited</h1>
      <p className="text-lg text-muted-foreground mb-6">
        We&apos;ve detected an unusual amount of requests coming from your device.
        Please wait a few minutes before trying again.
      </p>
      <p className="text-sm text-muted-foreground">
        If you continue to experience issues, please contact{" "}
        <a href={`mailto:${Constants.SUPPORT_EMAIL}`} className="text-primary hover:underline">
          {Constants.SUPPORT_EMAIL}
        </a>
      </p>
    </div>
  );
}
