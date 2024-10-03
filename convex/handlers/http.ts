import { internal } from "../_generated/api";
import { ActionCtx } from "../_generated/server";

export const stripeRouteHandler = async (ctx: ActionCtx, req: Request) => {
  const signature = req.headers.get("stripe-signature") as string;
  const result = await ctx.runAction(internal.stripe.webhook, {
    payload: await req.text(),
    signature,
  });

  if (result.success) {
    return new Response(null, {
      status: 200,
    });
  } else {
    return new Response("Stripe webhook error", {
      status: 400,
    });
  }
};

export const clerkRouteHandler = async (ctx: ActionCtx, req: Request) => {
  const payloadString = await req.text();
  const headerPayload = req.headers;

  try {
    const result = await ctx.runAction(internal.clerk.webhook, {
      payload: payloadString,
      headers: {
        "svix-id": headerPayload.get("svix-id"),
        "svix-timestamp": headerPayload.get("svix-timestamp"),
        "svix-signature": headerPayload.get("svix-signature"),
      },
    });

    switch (result.type) {
      case "user.created":
        await ctx.runMutation(internal.users.createSignedInUser, {
          userId: result.data.id,
          email: result.data.email_addresses[0].email_address,
        });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(`Webhook Error: ${error}`, {
      status: 400,
    });
  }
};
