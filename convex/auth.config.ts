import { convexEnv } from "./lib/convexEnv";

const authConfig = {
  providers: [
    {
      domain: convexEnv.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
