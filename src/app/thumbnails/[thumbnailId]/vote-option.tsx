import { ThumbnailUpload } from "@/app/create/thumbnail-upload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const VoteOption = ({
  imageId,
  title,
}: {
  imageId: string;
  title: string;
  thumbnailId: Id<"thumbnails">;
}) => {
  const { thumbnailId } = useParams<{ thumbnailId: Id<"thumbnails"> }>();
  const voteOnThumbnail = useMutation(api.thumbnails.voteOnThumbnail);
  const { toast } = useToast();
  const { session } = useSession();
  const thumbnail = useQuery(api.thumbnails.getThumbnail, {
    thumbnailId: thumbnailId,
  });
  const hasVoted = thumbnail?.votedUserIds.includes(session!.user.id);

  const vote = async () => {
    await voteOnThumbnail({
      imageId,
      thumbnailId,
    });
    toast({
      title: `You voted for ${title}!`,
      description: "Your vote has been recorded.",
      variant: "default",
      duration: 5000,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <ThumbnailUpload
        imageId={imageId}
        onUploadComplete={() => {}}
        showUpload={false}
        title={title}
      />
      {!hasVoted && (
        <Button size="lg" className="mt-2 w-[200px] mb-6" onClick={vote}>
          Vote
        </Button>
      )}
    </div>
  );
};
