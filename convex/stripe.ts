"use node";

import { GenericActionCtx, UserIdentity } from "convex/server";
import { ConvexError, v } from "convex/values";
import Stripe from "stripe";
import { internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";
import { DataModel } from "./_generated/dataModel";

type Metadata = {
  userId: string;
};

async function processCheckoutSessionCompletedEvent(
  ctx: GenericActionCtx<DataModel>,
  event: Stripe.CheckoutSessionCompletedEvent
): Promise<void> {
  const completedEvent = event.data.object as Stripe.Checkout.Session & {
    metadata: Metadata;
  };
  const userId = completedEvent.metadata.userId;

  await ctx.runMutation(internal.users.setStripeId, {
    userId,
    stripeId: completedEvent.id, // TODO: rename
  });
}

async function createCheckoutSession(
  user: UserIdentity
): Promise<Stripe.Response<Stripe.Checkout.Session>> {
  const domain = process.env.HOSTING_URL;
  console.log("Hosting URL:", domain);
  const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: "2024-06-20",
  });
  return await stripe.checkout.sessions.create({
    line_items: [
      {
        price: process.env.PRICE_ID,
        quantity: 1,
      },
    ],
    customer_email: user.email,
    mode: "payment",
    success_url: `${domain}`,
    cancel_url: `${domain}`,
    metadata: {
      userId: user.subject,
    },
  });
}

export const webhook = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx, args) => {
    const stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion: "2024-06-20",
    });

    const webhookSecret = process.env.STRIPE_WEBHOOKS_SECRET!;
    try {
      const event = stripe.webhooks.constructEvent(
        args.payload,
        args.signature,
        webhookSecret
      );

      if (event.type === "checkout.session.completed") {
        await processCheckoutSessionCompletedEvent(ctx, event);
      }
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: (error as { message: string }).message };
    }
  },
});

export const pay = action({
  args: {},
  handler: async (ctx) => {
    console.log("stripe.pay action called");
    const user = await ctx.auth.getUserIdentity();
    console.log("Caller user:", user);
    if (!user) {
      throw new ConvexError("You must  be logged in to pay");
    }
    if (!user.emailVerified) {
      throw new ConvexError("You must have a verified email to pay");
    }

    const session = await createCheckoutSession(user);
    console.log("Session URL:", session.url);
    return session.url;
  },
});
