"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import clsx from "clsx";
import {
  useSessionMutation,
  useSessionQuery,
} from "convex-helpers/react/sessions";
import { ConvexError } from "convex/values";
import { isEmpty } from "lodash";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { ThumbnailUpload } from "./thumbnail-upload";

interface FormErrors {
  title?: string;
  imageA?: string;
  imageB?: string;
}

// todo: set upload limit client/server side
export default function CreatePage() {
  const createPoll = useSessionMutation(api.thumbnailPolls.createThumbnailPoll);
  const [imageAId, setImageAId] = useState<string>("");
  const [imageBId, setImageBId] = useState<string>("");
  const router = useRouter();
  const creditsAvailable = useSessionQuery(api.users.getAvailableCredits);
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

    createPoll({
      aImageId: imageAId!,
      bImageId: imageBId!,
      title,
    })
      .then((pollId) => {
        toast({
          title: "Test created!",
        });
        router.push(`/thumbnail-polls/${pollId}`);
      })
      .catch((error: unknown) => {
        if (error instanceof ConvexError) {
          toast({
            title: "Error",
            description: error.data,
            variant: "destructive",
          });
        }
      });
  };

  const SubmitButton = () => {
    return (
      <Button type="submit" disabled={hasNoCreditsLeft} className="mt-6 mb-4">
        Create a Test (1 Credit)
      </Button>
    );
  };

  // todo: refactor to use react-hook-form
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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

        <SubmitButton />
        {hasNoCreditsLeft && (
          <Alert className="mb-4 max-w-sm">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Out of Credits</AlertTitle>
            <AlertDescription>
              No credits left to create a poll. Upgrade to get more credits.
            </AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}
