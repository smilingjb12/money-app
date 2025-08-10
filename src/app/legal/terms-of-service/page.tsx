import { Constants } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: Constants.LEGAL.TERMS_OF_SERVICE.TITLE,
  description: Constants.LEGAL.TERMS_OF_SERVICE.DESCRIPTION,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `${Constants.LEGAL.TERMS_OF_SERVICE.TITLE} | ${Constants.APP_NAME}`,
    description: Constants.LEGAL.TERMS_OF_SERVICE.DESCRIPTION,
    type: "article",
  },
};

export default function TermsOfService() {
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-xl text-muted-foreground">
          Last updated: {Constants.LEGAL.LAST_UPDATED}
        </p>
      </header>
      
      <article className="prose prose-lg max-w-none">
        <div className="text-muted-foreground space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptance of Terms</h2>
            <p>
              By accessing and using {Constants.APP_NAME}, you accept and agree to be bound by 
              the terms and provision of this agreement.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Use License</h2>
            <p>
              Permission is granted to temporarily access {Constants.APP_NAME} for personal, 
              non-commercial transitory viewing only. This license shall automatically terminate 
              if you violate any of these restrictions.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account information 
              and for all activities that occur under your account.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Service Modifications</h2>
            <p>
              {Constants.APP_NAME} reserves the right to modify or discontinue the service 
              at any time with or without notice.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
            <p>
              Questions about these terms should be sent to{" "}
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
