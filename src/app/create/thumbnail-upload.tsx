import { UploadFileResponse } from "@xixixao/uploadstuff";
import { UploadButton } from "@xixixao/uploadstuff/react";
import clsx from "clsx";
import { useSessionMutation } from "convex-helpers/react/sessions";
import { useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface ThumbnailUploadProps {
  title: string;
  imageId: string;
  onUploadComplete: (uploaded: UploadFileResponse[]) => void;
  showUpload: boolean;
  error?: string;
}

export function ThumbnailUpload({
  title,
  imageId,
  onUploadComplete,
  showUpload,
  error,
}: ThumbnailUploadProps) {
  const generateUploadUrl = useSessionMutation(api.files.generateUploadUrl);
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
        "flex flex-col gap-4 border border-1 rounded-sm p-2 overflow-hidden relative h-[350px]",
        error ? "border-red-400" : "border-transparent"
      )}
    >
      <h2 className="text-2xl font-bold">{title}</h2>
      {imageId && (
        <Image
          className="object-cover"
          fill
          alt={`Image ${title}`}
          src={imageUrl}
        />
      )}
      {showUpload && (
        <div className="flex justify-center">
          <UploadButton
            uploadUrl={generateUploadUrl}
            fileTypes={["image/*"]}
            onUploadComplete={onUploadComplete}
            onUploadError={(error: unknown) => {
              console.error(error);
            }}
          />
        </div>
      )}

      {error && <div className="text-red-400">{error}</div>}
    </div>
  );
}
