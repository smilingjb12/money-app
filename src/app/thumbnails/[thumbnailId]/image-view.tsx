import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { VoteCount } from "./vote-count";
import { VoteOption } from "./vote-option";

export const ImageView = ({
  imageId,
  title,
}: {
  imageId: string;
  title: string;
}) => {
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
