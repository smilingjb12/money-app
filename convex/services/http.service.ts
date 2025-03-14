import { WebhookEvent } from "@clerk/express";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { internal } from "../_generated/api";
import { ActionCtx } from "../_generated/server";
import { convexEnv } from "../lib/convexEnv";
import { StripeService } from "./stripe.service";

const SVIX_ID_HEADER = "svix-id";
const SVIX_TIMESTAMP_HEADER = "svix-timestamp";
const SVIX_SIGNATURE_HEADER = "svix-signature";

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
      const result = verifyClerkWebhook({
        payload: payloadString,
        headers: headerPayload,
      });

      console.log("Processing", result.type, "event:", result.data);
      await processClerkEvent(ctx, result);
      return new Response(null, { status: 200 });
    } catch (error) {
      console.error("Clerk webhook error", error);
      /* eslint-disable-next-line  @typescript-eslint/restrict-template-expressions   */
      return new Response(`Webhook Error: ${error}`, {
        status: 400,
      });
    }
  },
};

function verifyClerkWebhook(args: { headers: Headers; payload: string }) {
  const wh = new Webhook(convexEnv.CLERK_WEBHOOK_SECRET);
  const webhookHeaders: WebhookRequiredHeaders = {
    [SVIX_ID_HEADER]: args.headers.get(SVIX_ID_HEADER)!,
    [SVIX_TIMESTAMP_HEADER]: args.headers.get(SVIX_TIMESTAMP_HEADER)!,
    [SVIX_SIGNATURE_HEADER]: args.headers.get(SVIX_SIGNATURE_HEADER)!,
  };
  const payload = wh.verify(args.payload, webhookHeaders) as WebhookEvent;
  return payload;
}

async function processClerkEvent(ctx: ActionCtx, result: WebhookEvent) {
  switch (result.type) {
    case "user.created":
    case "user.updated":
      await ctx.runMutation(internal.users.createOrUpdateUser, {
        externalUserId: result.data.id,
        email: result.data.email_addresses[0].email_address,
      });
      break;
    case "user.deleted":
      await ctx.runMutation(internal.users.deleteUser, {
        externalUserId: result.data.id!,
      });
      break;
  }
}
