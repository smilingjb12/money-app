"use node";

import { WebhookEvent } from "@clerk/clerk-sdk-node";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { ActionCtx } from "../_generated/server";

export const clearkWebhookHandler = async (
  ctx: ActionCtx,
  args: { headers: WebhookRequiredHeaders; payload: string }
) => {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
  return payload;
};
