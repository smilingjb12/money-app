import { ActionCtx } from "../_generated/server";
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
};
