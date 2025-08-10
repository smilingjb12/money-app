import { MetadataRoute } from "next";
import { Constants } from "@/constants";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = Constants.SEO.SITE_URL;
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/collection/',
          '/create/',
          '/upgrade/',
          '/rate-limited/',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}