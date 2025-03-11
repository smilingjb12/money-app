import { WebhookEvent } from "@clerk/express";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { internal } from "../_generated/api";
import { ActionCtx } from "../_generated/server";
import { convexEnv } from "../lib/convexEnv";
import { StripeService } from "./stripe.service";

export const HttpService = {
  async processStripeWebhook(ctx: ActionCtx, req: Request) {
    const signature = req.headers.get("stripe-signature") as string;
    const result = await StripeService.processCheckoutSessionCompletedEvent(
      ctx,
      {
        payload: await req.text(),
        signature,
      }
    );

    if (result.success) {
      return new Response(null, {
        status: 200,
      });
    } else {
      return new Response("Stripe webhook error", {
        status: 400,
      });
    }
  },

  async processClerkWebhook(ctx: ActionCtx, req: Request) {
    console.log("Processing clerk webhook");
    const payloadString = await req.text();
    const headerPayload = req.headers;

    try {
      const result = HttpService.verifyClerkWebhook({
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      switch (result.type) {
        case "user.created":
          console.log("Processing user.created event:", result.data);
          await ctx.runMutation(internal.users.createSignedInUser, {
            userId: result.data.id,
            email: result.data.email_addresses[0].email_address,
          });
      }

      return new Response(null, { status: 200 });
    } catch (error) {
      console.error("Clerk webhook error", error);
      /* eslint-disable-next-line  @typescript-eslint/restrict-template-expressions   */
      return new Response(`Webhook Error: ${error}`, {
        status: 400,
      });
    }
  },

  verifyClerkWebhook(args: {
    headers: WebhookRequiredHeaders;
    payload: string;
  }) {
    const wh = new Webhook(convexEnv.CLERK_WEBHOOK_SECRET);
    const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
    return payload;
  },
};
