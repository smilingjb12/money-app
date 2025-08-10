import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "./header";
import { Providers } from "./providers";
import ScrollToTop from "@/components/scroll-to-top";
import { Constants } from "@/constants";
import NextTopLoader from "nextjs-toploader";
import { ConditionalFooter } from "./conditional-footer";

export const metadata: Metadata = {
  title: {
    default: Constants.APP_NAME,
    template: `%s | ${Constants.APP_NAME}`,
  },
  description: Constants.APP_DESCRIPTION_META,
  keywords: Constants.SEO.KEYWORDS,
  authors: [{ name: Constants.APP_NAME }],
  creator: Constants.APP_NAME,
  publisher: Constants.APP_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(Constants.SEO.SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: Constants.APP_NAME,
    description: Constants.APP_DESCRIPTION_META,
    siteName: Constants.APP_NAME,
    images: [
      {
        url: Constants.SEO.OG_IMAGE_PATH,
        width: Constants.SEO.OG_IMAGE_WIDTH,
        height: Constants.SEO.OG_IMAGE_HEIGHT,
        alt: `${Constants.APP_NAME} - Project Management Platform`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: Constants.APP_NAME,
    description: Constants.APP_DESCRIPTION_META,
    images: [Constants.SEO.OG_IMAGE_PATH],
    creator: Constants.SEO.TWITTER_HANDLE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: Constants.SEO.GOOGLE_VERIFICATION,
    yandex: Constants.SEO.YANDEX_VERIFICATION,
  },
};

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: Constants.APP_NAME,
    description: Constants.APP_DESCRIPTION_META,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: Constants.APP_NAME,
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <NextTopLoader
            showSpinner={false}
            color={Constants.TOP_LOADER_COLOR}
          />
          <ScrollToTop />
          <Header />
          <div className="flex min-h-screen w-full flex-col py-32 px-6">
            {children}
          </div>
          <ConditionalFooter />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
