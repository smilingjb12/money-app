"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import clsx from "clsx";
import { useSessionId } from "convex-helpers/react/sessions";
import { useMutation, useQuery } from "convex/react";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { ThumbnailUpload } from "./thumbnail-upload";

interface FormErrors {
  title?: string;
  imageA?: string;
  imageB?: string;
}

export default function CreatePage() {
  const [sessionId] = useSessionId();
  const createPoll = useMutation(api.thumbnailPolls.createThumbnailPoll);
  const [imageAId, setImageAId] = useState<string>("");
  const [imageBId, setImageBId] = useState<string>("");
  const router = useRouter();
  const creditsAvailable = useQuery(api.users.getAvailableCredits, {
    sessionId: sessionId!,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { toast } = useToast();

  const hasNoCreditsLeft = creditsAvailable === 0;

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
      return;
    }

    const thumbnailId = await createPoll({
      aImageId: imageAId!,
      bImageId: imageBId!,
      title,
      sessionId: sessionId!,
    });

    router.push(`/thumbnail-polls/${thumbnailId}`);
  };

  const SubmitButton = () => {
    return (
      <Button type="submit" disabled={hasNoCreditsLeft} className="mt-6 mb-4">
        Create a Test (1 Credit)
      </Button>
    );
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
            showUpload={!hasNoCreditsLeft}
            imageId={imageAId}
            onUploadComplete={async (uploaded: UploadFileResponse[]) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setImageAId(
                (uploaded[0].response as { storageId: string }).storageId
              );
            }}
            error={errors.imageA}
          />
          <ThumbnailUpload
            title="Test image B"
            showUpload={!hasNoCreditsLeft}
            imageId={imageBId}
            onUploadComplete={async (uploaded: UploadFileResponse[]) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setImageBId((uploaded[0].response as any).storageId);
            }}
            error={errors.imageB}
          />
        </div>

        {hasNoCreditsLeft ? (
          <Hint
            label="No more credits available. Purchase more for additional tests"
            side="right"
          >
            <div className="w-fit">
              <SubmitButton />
            </div>
          </Hint>
        ) : (
          <SubmitButton />
        )}
      </form>
    </div>
  );
}
