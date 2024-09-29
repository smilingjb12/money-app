"use node";

import Stripe from "stripe";
import { action, internalAction, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";

type Metadata = {
  userId: string;
};

export const fulfill = internalAction({
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
        const completedEvent = event.data.object as Stripe.Checkout.Session & {
          metadata: Metadata;
        };
        const userId = completedEvent.metadata.userId;

        await ctx.runMutation(internal.users.setStripeId, {
          userId,
          stripeId: completedEvent.id,
        });
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
  handler: async (ctx, args) => {
    console.log("stripe.pay action called");
    const user = await ctx.auth.getUserIdentity();
    console.log("Caller user:", user);
    if (!user) {
      throw new ConvexError("You must  be logged in to pay");
    }
    if (!user.emailVerified) {
      throw new ConvexError("You must have a verified email to pay");
    }

    const domain = process.env.HOSTING_URL;
    console.log("Hosting URL:", domain);
    const stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion: "2024-06-20",
    });
    const session = await stripe.checkout.sessions.create({
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

    console.log("Session URL:", session.url);
    return session.url;
  },
});
