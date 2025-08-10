import { Constants } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: Constants.LEGAL.PRIVACY_POLICY.TITLE,
  description: Constants.LEGAL.PRIVACY_POLICY.DESCRIPTION,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `${Constants.LEGAL.PRIVACY_POLICY.TITLE} | ${Constants.APP_NAME}`,
    description: Constants.LEGAL.PRIVACY_POLICY.DESCRIPTION,
    type: "article",
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground">
          Last updated: {Constants.LEGAL.LAST_UPDATED}
        </p>
      </header>
      
      <article className="prose prose-lg max-w-none">
        <div className="text-muted-foreground space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
            <p>
              At {Constants.APP_NAME}, we take your privacy seriously. This privacy policy explains how we collect, 
              use, and protect your personal information when you use our service.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, 
              process transactions, and communicate with you about your account.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this privacy policy.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at{" "}
              <a href={`mailto:${Constants.SUPPORT_EMAIL}`} className="text-primary hover:underline">
                {Constants.SUPPORT_EMAIL}
              </a>
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
