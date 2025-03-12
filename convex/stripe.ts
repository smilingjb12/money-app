"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { StripeService } from "./services/stripe.service";

export const pay = action({
  args: { stripePriceId: v.string() },
  handler: async (ctx, args) => {
    // [AllowAnonymous]
    return await StripeService.pay(ctx, args);
  },
});
