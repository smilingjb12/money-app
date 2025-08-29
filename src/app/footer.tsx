import { Constants } from "@/constants";
import { Routes } from "@/lib/routes";
import { PackageIcon } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const footerLinks = [
    { href: Routes.termsOfService(), label: "Terms of Service" },
    { href: Routes.privacyPolicy(), label: "Privacy Policy" },
    { href: Routes.refundPolicy(), label: "Refund Policy" },
  ];

  return (
    <footer className="bg-background/60 backdrop-blur py-12 border-t border-border/70">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit">
              <PackageIcon className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold text-foreground">
                {Constants.APP_NAME}
              </span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              {Constants.APP_DESCRIPTION_META}
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {Constants.APP_NAME}. All rights reserved.
            </p>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${Constants.SUPPORT_EMAIL}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

