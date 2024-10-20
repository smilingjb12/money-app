import { ThumbnailUpload } from "@/app/create/thumbnail-upload";

export const VoteOption = ({
  title,
  fileId,
}: {
  fileId: string;
  title: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <ThumbnailUpload
        fileId={fileId}
        onUploadComplete={() => {}}
        showUpload={false}
        title={title}
      />
    </div>
  );
};
