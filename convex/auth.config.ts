import { convexEnv } from "./lib/convexEnv";

export default {
  providers: [
    {
      domain: convexEnv.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
