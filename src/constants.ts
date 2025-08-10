export const Constants = {
  APP_NAME: "FlowSpace",
  APP_DESCRIPTION_META: "Streamline your workflow, collaborate with your team, and manage projects efficiently with FlowSpace - the all-in-one SaaS platform for modern teams.",
  SUPPORT_EMAIL: "support@flowspace.app",
  TOP_LOADER_COLOR: "hsl(var(--primary) / 0.6)",
  STRIPE_API_VERSION: "2025-01-27.acacia" as const,
  
  // SEO Configuration
  SEO: {
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://flowspace.app',
    KEYWORDS: [
      "project management",
      "team collaboration", 
      "workflow automation",
      "SaaS platform",
      "productivity tools",
      "team management",
      "project tracking",
      "business tools"
    ],
    TWITTER_HANDLE: "@flowspace",
    OG_IMAGE_PATH: "/og-image.png",
    OG_IMAGE_WIDTH: 1200,
    OG_IMAGE_HEIGHT: 630,
    GOOGLE_VERIFICATION: "google-site-verification-token",
    YANDEX_VERIFICATION: "yandex-verification-token",
  },
  
  // Legal Pages Content
  LEGAL: {
    LAST_UPDATED: new Date().toLocaleDateString(),
    PRIVACY_POLICY: {
      TITLE: "Privacy Policy",
      DESCRIPTION: "Learn how FlowSpace protects your privacy and handles your personal information. Our comprehensive privacy policy explains data collection, usage, and security practices.",
    },
    TERMS_OF_SERVICE: {
      TITLE: "Terms of Service", 
      DESCRIPTION: "Read the terms and conditions for using FlowSpace. Our terms of service outline user responsibilities, service limitations, and legal agreements.",
    },
    REFUND_POLICY: {
      TITLE: "Refund Policy",
      DESCRIPTION: "Understand FlowSpace's refund policy and procedures. Learn about eligibility requirements, timeframes, and the refund process for our services.",
    },
  },
  
  // Business Information
  BUSINESS: {
    TAGLINE: "Manage Your Projects in One Place",
    VALUE_PROPOSITION: "Streamline your workflow, collaborate with your team, and bring your ideas to life with our powerful SaaS platform.",
    FEATURES: {
      PERFORMANCE: {
        TITLE: "Lightning Fast Performance",
        SUBTITLE: "Built for speed and efficiency",
        DESCRIPTION: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      COLLABORATION: {
        TITLE: "Seamless Team Collaboration", 
        SUBTITLE: "Work together like never before",
        DESCRIPTION: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      },
      ANALYTICS: {
        TITLE: "Smart Analytics & Insights",
        SUBTITLE: "Make data-driven decisions", 
        DESCRIPTION: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      },
    },
  },
};
