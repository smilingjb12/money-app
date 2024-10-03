"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";

import { UploadFileResponse } from "@/components/upload-zone/upload-files";
import { useMutationErrorHandler } from "@/hooks/use-mutation-error-handler";
import { useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { isEmpty } from "lodash";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
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
  const { session } = useSession();
  const { handleError } = useMutationErrorHandler();
  const createPoll = useMutation(api.thumbnailPolls.createThumbnailPoll);
  const [imageAId, setImageAId] = useState<string>("");
  const [imageBId, setImageBId] = useState<string>("");
  const router = useRouter();
  const creditsAvailable = useQuery(api.users.getAvailableCredits);
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
      .catch(handleError);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-8">
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

        <div className="flex justify-start">
          <Button
            type="submit"
            disabled={!!session && hasNoCreditsLeft}
            className="mt-6 mb-4"
          >
            Create a Poll (1 credit)
          </Button>
        </div>
        {!!session && hasNoCreditsLeft && (
          <Alert className="mb-4 max-w-lg">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Out of Credits</AlertTitle>
            <AlertDescription className="text-left">
              No credits left to create a poll.{" "}
              <Button asChild variant="default">
                <Link href="/upgrade">Upgrade</Link>
              </Button>{" "}
              to get more credits.
            </AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}
