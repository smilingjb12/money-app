import { Constants } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: Constants.LEGAL.REFUND_POLICY.TITLE,
  description: Constants.LEGAL.REFUND_POLICY.DESCRIPTION,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `${Constants.LEGAL.REFUND_POLICY.TITLE} | ${Constants.APP_NAME}`,
    description: Constants.LEGAL.REFUND_POLICY.DESCRIPTION,
    type: "article",
  },
};

export default function RefundPolicy() {
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Refund Policy</h1>
        <p className="text-xl text-muted-foreground">
          Last updated: {Constants.LEGAL.LAST_UPDATED}
        </p>
      </header>
      
      <article className="prose prose-lg max-w-none">
        <div className="text-muted-foreground space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Refund Eligibility</h2>
            <p>
              At {Constants.APP_NAME}, we want you to be completely satisfied with our service. 
              We offer refunds under certain conditions as outlined in this policy.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Refund Timeframe</h2>
            <p>
              Refund requests must be submitted within 30 days of your purchase. 
              Refunds are processed within 5-7 business days after approval.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">How to Request a Refund</h2>
            <p>
              To request a refund, please contact our support team with your account details 
              and reason for the refund request. We will review your request promptly.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Partial Refunds</h2>
            <p>
              In certain circumstances, partial refunds may be granted at our discretion, 
              particularly for accounts that have been partially used.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact for Refunds</h2>
            <p>
              For refund requests or questions about this policy, please email{" "}
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
