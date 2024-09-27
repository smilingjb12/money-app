"use client";

import LoadingIndicator from "@/components/loading-indicator";
import { useQuery } from "convex/react";
import { shuffle } from "lodash";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ImageView } from "./image-view";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useSession } from "@clerk/nextjs";

export default function ThumbnailPage() {
  const { session } = useSession();
  const params = useParams<{ thumbnailId: Id<"thumbnails"> }>();
  const thumbnail = useQuery(api.thumbnails.getThumbnail, {
    thumbnailId: params.thumbnailId,
  });
  const hasVoted = thumbnail?.votedUserIds.includes(session!.user.id);

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
      {hasVoted && (
        <div className="flex justify-center">
          <Alert
            className="mt-4 max-w-xs bg-orange-100 dark:text-slate-900"
            variant="default"
          >
            <AlertCircle className="h-4 w-4 dark:text-slate-900" />
            <AlertTitle>Voting not available</AlertTitle>
            <AlertDescription>
              You have already voted for this poll.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
