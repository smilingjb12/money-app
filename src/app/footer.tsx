import { Constants } from "@/constants";
import Link from "next/link";

export function Footer() {
  const footerLinks = [
    { href: "/legal/terms-of-service", label: "Terms of Service" },
    { href: "/legal/privacy-policy", label: "Privacy Policy" },
    { href: "/legal/refund-policy", label: "Refund Policy" },
  ];

  return (
    <div className="bg-background py-8 border-t border-accent/70">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="text-center md:text-left mb-4 md:mb-0 space-y-2">
          <p className="text-sm text-primary-foreground/70">
            Copyright @ {new Date().getFullYear()} {Constants.APP_NAME}. All
            rights reserved.
          </p>
        </div>
        <nav className="flex gap-4">
          {footerLinks.map((link) => (
            <Link
              href={link.href}
              className="text-sm text-primary-foreground/70 hover:text-primary-foreground"
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
