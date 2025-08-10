import { httpRouter } from "convex/server";
import { ActionCtx, httpAction } from "./_generated/server";
import { auth } from "./auth";
import { HttpService } from "./services/http.service";

const http = httpRouter();

// Add Convex Auth routes
auth.addHttpRoutes(http);

http.route({
  path: "/stripe",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    return await HttpService.processStripeWebhook(ctx as ActionCtx, req);
  }),
});

export default http;
