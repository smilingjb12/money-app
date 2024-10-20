"use client";

import LoadingIndicator from "@/components/loading-indicator";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ImageView } from "./image-view";

export default function ThumbnailPage() {
  const params = useParams<{ imageId: Id<"images"> }>();
  const image = useQuery(api.images.getImage, {
    imageId: params.imageId,
  });

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
