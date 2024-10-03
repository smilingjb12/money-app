"use client";

import { settings } from "@/lib/settings";
import { PlaneIcon, RocketIcon, SendIcon } from "lucide-react";
import { PricingCard } from "./pricing-card";

export default function UpgradePage() {
  return (
    <section className="bg-white dark:bg-gray-900 mx-auto max-w-screen-2xl">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Purchase credits
          </h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Every new image you create in the web application deducts a fixed
            amount of credits from your account balance.
          </p>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          <PricingCard
            description="~$0.10 per image"
            stripePriceId={settings.getStripeTier1PriceId()}
            iconGenerator={() => <SendIcon className="size-14" />}
            credits={settings.getStripeTier1Credits()}
          />
          <PricingCard
            description="~$0.09 per image"
            stripePriceId={settings.getStripeTier2PriceId()}
            iconGenerator={() => <PlaneIcon className="size-14" />}
            credits={settings.getStripeTier2Credits()}
          />
          <PricingCard
            description="~$0.08 per image"
            stripePriceId={settings.getStripeTier3PriceId()}
            iconGenerator={() => <RocketIcon className="size-14" />}
            credits={settings.getStripeTier3Credits()}
          />
        </div>
      </div>
    </section>
  );
}
