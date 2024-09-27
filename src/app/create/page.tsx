"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import { useMutation } from "convex/react";
import { isEmpty } from "lodash";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { ThumbnailUpload } from "./thumbnail-upload";
import clsx from "clsx";
import { useRouter } from "next/navigation";

interface FormErrors {
  title?: string;
  imageA?: string;
  imageB?: string;
}

export default function CreatePage() {
  const createThumbnail = useMutation(api.thumbnails.createThumbnail);
  const [imageAId, setImageAId] = useState<string>("");
  const [imageBId, setImageBId] = useState<string>("");
  const router = useRouter();

  const [errors, setErrors] = useState<FormErrors>({});
  const { toast } = useToast();

  const validateForm = (title: string, imageAId: string, imageBId: string) => {
    const formErrors: FormErrors = {};
    if (!title) {
      formErrors.title = "Fill in the title please";
    }
    if (!imageAId) {
      formErrors.imageA = "Upload image A please";
    }
    if (!imageBId) {
      formErrors.imageB = "Upload image B please";
    }
    return formErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const formErrors = validateForm(title, imageAId, imageBId);
    setErrors(formErrors);
    if (!isEmpty(formErrors)) {
      toast({
        title: "Form Errors",
        description: "Please fill all fields on the page",
        variant: "destructive",
      });
      return;
    }

    const thumbnailId = await createThumbnail({
      aImageId: imageAId!,
      bImageId: imageBId!,
      title,
    });

    router.push(`/thumbnails/${thumbnailId}`);
  };

  return (
    <div className="mx-auto max-w-screen-lg">
      <h1 className="text-4xl font-bold mb-6">Create a Thumbnail Test</h1>
      <p className="text-lg max-w-screen-md mb-6">
        Create your test so that other people can vote on their favorite
        thumbnail and help you redesign or pick the best option.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col max-w-screen-sm mb-8">
          <Label htmlFor="title" className="text-md">
            Your Test Title
          </Label>
          <Input
            id="title"
            name="title"
            type="text"
            className={clsx("text-lg", {
              "border-red-400 border": errors.title,
            })}
            placeholder="Label your test to make it easier to manage later"
          />
          {errors.title && <div className="text-red-400">{errors.title}</div>}
        </div>
        <div className="grid grid-cols-2 gap-8 mb-8">
          <ThumbnailUpload
            title="Test image A"
            showUpload={true}
            imageId={imageAId}
            onUploadComplete={async (uploaded: UploadFileResponse[]) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setImageAId((uploaded[0].response as any).storageId);
            }}
            error={errors.imageA}
          />
          <ThumbnailUpload
            title="Test image B"
            showUpload={true}
            imageId={imageBId}
            onUploadComplete={async (uploaded: UploadFileResponse[]) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setImageBId((uploaded[0].response as any).storageId);
            }}
            error={errors.imageB}
          />
        </div>

        <Button className="mt-8">Create Thumbnail Test</Button>
      </form>
    </div>
  );
}
