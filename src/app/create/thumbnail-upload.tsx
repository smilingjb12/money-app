import { UploadFileResponse } from "@xixixao/uploadstuff";
import { UploadButton } from "@xixixao/uploadstuff/react";
import clsx from "clsx";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Image from "next/image";
import { Id } from "../../../convex/_generated/dataModel";

interface ThumbnailUploadProps {
  title: string;
  imageId: string;
  onUploadComplete: (uploaded: UploadFileResponse[]) => void;
  error?: string;
}

export function ThumbnailUpload({
  title,
  imageId,
  onUploadComplete,
  error,
}: ThumbnailUploadProps) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const imageUrl = useQuery(
    api.files.getFileUrl,
    imageId
      ? {
          fileId: imageId as Id<"_storage">,
        }
      : "skip"
  )!;

  return (
    <div
      className={clsx(
        "flex flex-col gap-4 border border-1 rounded-sm p-2",
        error ? "border-red-500" : "border-transparent"
      )}
    >
      <h2 className="text-2xl font-bold">{title}</h2>
      {imageId && (
        <Image width={200} height={200} alt={`Image ${title}`} src={imageUrl} />
      )}
      <UploadButton
        uploadUrl={generateUploadUrl}
        fileTypes={["image/*"]}
        onUploadComplete={onUploadComplete}
        onUploadError={(error: unknown) => {
          console.error(error);
        }}
      />
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
