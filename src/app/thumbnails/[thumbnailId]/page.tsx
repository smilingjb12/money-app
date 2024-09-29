"use client";

import LoadingIndicator from "@/components/loading-indicator";
import { Button } from "@/components/ui/button";
import { SignInButton, useSession } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { shuffle } from "lodash";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ImageView } from "./image-view";

export default function ThumbnailPage() {
  const { session, isSignedIn } = useSession();
  const params = useParams<{ thumbnailId: Id<"thumbnails"> }>();
  const thumbnail = useQuery(api.thumbnails.getThumbnail, {
    thumbnailId: params.thumbnailId,
  });

  const images = useMemo(() => {
    return shuffle([thumbnail?.aImageId, thumbnail?.bImageId]);
  }, [thumbnail?.aImageId, thumbnail?.bImageId]);

  if (thumbnail == null) {
    return <LoadingIndicator className="mt-40" />;
  }

  return (
    <div className="mx-auto max-w-screen-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImageView imageId={images[0]!} title="Image A" />
        <ImageView imageId={images[1]!} title="Image B" />
      </div>
      {!isSignedIn && (
        <div className="flex items-center justify-center mt-20">
          <Button asChild>
            <SignInButton>Sign in to Vote</SignInButton>
          </Button>
        </div>
      )}
    </div>
  );
}
