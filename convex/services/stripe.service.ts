import { GenericActionCtx, UserIdentity } from "convex/server";
import { ConvexError } from "convex/values";
import Stripe from "stripe";
import { Constants } from "../../src/constants";
import { internal } from "../_generated/api";
import { DataModel } from "../_generated/dataModel";
import { ActionCtx } from "../_generated/server";
import { convexEnv } from "../lib/convexEnv";

const PRICE_ID_CREDITS: Record<string, number> = {
  [convexEnv.NEXT_PUBLIC_STRIPE_TIER_1_PRICEID]: Number(
    convexEnv.NEXT_PUBLIC_STRIPE_TIER_1_CREDITS
  ),
  [convexEnv.NEXT_PUBLIC_STRIPE_TIER_2_PRICEID]: Number(
    convexEnv.NEXT_PUBLIC_STRIPE_TIER_2_CREDITS
  ),
  [convexEnv.NEXT_PUBLIC_STRIPE_TIER_3_PRICEID]: Number(
    convexEnv.NEXT_PUBLIC_STRIPE_TIER_3_CREDITS
  ),
};

type Metadata = {
  userId: string;
  priceId: string;
};

export const StripeService = {
  async pay(ctx: ActionCtx, args: { stripePriceId: string }) {
    console.log("stripe.pay action called");
    const user = await ctx.auth.getUserIdentity();
    console.log("Caller user:", user);
    if (!user) {
      throw new ConvexError("You must be logged in to purchase credits");
    }
    if (!user.emailVerified) {
      throw new ConvexError("You must have a verified email to pay");
    }

    const session = await createCheckoutSession(user, args.stripePriceId);
    console.log("Session URL:", session.url);
    return session.url;
  },

  async processCheckoutSessionCompletedEvent(
    ctx: ActionCtx,
    args: { payload: string; signature: string }
  ) {
    const stripe = new Stripe(convexEnv.STRIPE_KEY, {
      apiVersion: Constants.STRIPE_API_VERSION,
    });

    const webhookSecret = convexEnv.STRIPE_WEBHOOKS_SECRET;
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
};

async function createCheckoutSession(
  user: UserIdentity,
  stripePriceId: string
): Promise<Stripe.Response<Stripe.Checkout.Session>> {
  const domain = convexEnv.SITE_URL;
  console.log("Hosting URL:", domain);
  const stripe = new Stripe(convexEnv.STRIPE_KEY, {
    apiVersion: Constants.STRIPE_API_VERSION,
  });
  return await stripe.checkout.sessions.create({
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    customer_email: user.email,
    mode: "payment",
    success_url: `${domain}`,
    cancel_url: `${domain}`,
    metadata: {
      userId: user.subject, // this is externalUserId
      priceId: stripePriceId,
    },
  });
}

async function processCheckoutSessionCompletedEvent(
  ctx: GenericActionCtx<DataModel>,
  event: Stripe.CheckoutSessionCompletedEvent
): Promise<void> {
  const completedEvent = event.data.object as Stripe.Checkout.Session & {
    metadata: Metadata;
  };
  const userId = completedEvent.metadata.userId;
  console.log("Completed checkout session event:", completedEvent);
  const priceId = completedEvent.metadata.priceId;
  await ctx.runMutation(internal.users._addCredits, {
    userId: userId,
    stripeCheckoutSessionId: completedEvent.id,
    stripeItemId: priceId,
    creditsToAdd: PRICE_ID_CREDITS[priceId],
  });
}
