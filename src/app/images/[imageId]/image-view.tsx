import { Doc } from "../../../../convex/_generated/dataModel";
import { VoteOption } from "./vote-option";

export const ImageView = ({
  title,
  image,
}: {
  image: Doc<"images">;
  title: string;
}) => {
  return (
    <div>
      <VoteOption fileId={image.fileId} title={title} />
      <div className="mt-3"></div>
    </div>
  );
};
