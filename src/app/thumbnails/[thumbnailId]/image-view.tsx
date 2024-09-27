import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { VoteCount } from "./vote-count";
import { VoteOption } from "./vote-option";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useSession } from "@clerk/nextjs";

export const ImageView = ({
  imageId,
  title,
}: {
  imageId: string;
  title: string;
}) => {
  const { session } = useSession();
  const { thumbnailId } = useParams<{ thumbnailId: Id<"thumbnails"> }>();
  const thumbnail = useQuery(api.thumbnails.getThumbnail, {
    thumbnailId: thumbnailId,
  });

  const getVotesForImage = (imageId: string): number => {
    return thumbnail?.aImageId === imageId
      ? thumbnail!.aVotes
      : thumbnail!.bVotes;
  };

  const getVotePercentage = (imageId: string) => {
    const totalVotes = thumbnail!.aVotes + thumbnail!.bVotes;
    return (
      100.0 * (getVotesForImage(imageId) / (totalVotes === 0 ? 1 : totalVotes))
    );
  };

  return (
    <div>
      <VoteOption imageId={imageId} title={title} thumbnailId={thumbnailId} />
      <div className="mt-3"></div>
      <VoteCount
        votes={getVotesForImage(imageId)}
        percentage={getVotePercentage(imageId)}
      />
    </div>
  );
};
