"use client";

import LoadingIndicator from "@/components/loading-indicator";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ImageView } from "./image-view";
import { Constants } from "@/constants";
import { useEffect } from "react";

export default function ThumbnailPage() {
  const params = useParams<{ imageId: Id<"images"> }>();
  const image = useQuery(api.images.getImage, {
    imageId: params.imageId,
  });

  useEffect(() => {
    if (image) {
      const title = `Image ${params.imageId} | ${Constants.APP_NAME}`;
      const description = `View and interact with this image on ${Constants.APP_NAME}. Share your opinion and see what others think about this content.`;
      
      document.title = title;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }

      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', title);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:title');
        meta.content = title;
        document.head.appendChild(meta);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:description');
        meta.content = description;
        document.head.appendChild(meta);
      }

      const ogType = document.querySelector('meta[property="og:type"]');
      if (ogType) {
        ogType.setAttribute('content', 'article');
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:type');
        meta.content = 'article';
        document.head.appendChild(meta);
      }
    }
  }, [image, params.imageId]);

  if (image == null) {
    return <LoadingIndicator className="mt-40" />;
  }

  return (
    <div className="container items-center justify-center max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
        <ImageView image={image} title="Image" />
      </div>
    </div>
  );
}
