"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";

import { ActionButton } from "@/components/action-button";
import { UploadFileResponse } from "@/components/upload-zone/upload-files";
import { useMutationErrorHandler } from "@/hooks/use-mutation-error-handler";
import { Routes } from "@/lib/routes";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { isEmpty } from "lodash";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { ThumbnailUpload } from "./thumbnail-upload";

interface FormErrors {
  title?: string;
  fileId?: string;
}

export default function CreatePage() {
  const { signIn } = useAuthActions();
  const user = useQuery(api.users.getCurrentUser);
  const [loading, setLoading] = useState(false);
  const { handleError } = useMutationErrorHandler();
  const uploadImage = useMutation(api.images.uploadImage);
  const [fileId, setFileId] = useState<string>("");
  const router = useRouter();
  const creditsAvailable = useQuery(api.users.getAvailableCredits);
  const [errors, setErrors] = useState<FormErrors>({});
  const { toast } = useToast();

  const hasNoCreditsLeft = creditsAvailable === 0;

  const validateForm = (title: string, fileId: string) => {
    const formErrors: FormErrors = {};
    if (!title) {
      formErrors.title = "Fill in the title please";
    }
    if (!fileId) {
      formErrors.fileId = "Upload image please";
    }
    return formErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const formErrors = validateForm(title, fileId);
    setErrors(formErrors);
    if (!isEmpty(formErrors)) {
      return;
    }

    setLoading(true);
    uploadImage({
      fileId: fileId,
      title,
    })
      .then((imageId) => {
        toast({
          title: "Test created!",
        });
        router.push(Routes.imageWithId(imageId));
      })
      .catch(handleError)
      .finally(() => setLoading(false));
  };

  return (
    <div className="container items-center justify-center max-w-6xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Create a Thumbnail Test
      </h1>
      <p className="text-lg max-w-(--breakpoint-md) mx-auto mb-6 text-center">
        Create your test so that other people can vote on their favorite
        thumbnail and help you redesign or pick the best option.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col max-w-(--breakpoint-sm) mb-8 mx-auto">
          <Label htmlFor="title" className="text-md">
            Your Test Title
          </Label>
          <Input
            id="title"
            name="title"
            type="text"
            className={clsx("text-lg", {
              "border-destructive border": errors.title,
            })}
            placeholder="Label your test to make it easier to manage later"
          />
          {errors.title && (
            <div className="text-destructive">{errors.title}</div>
          )}
        </div>
        {!hasNoCreditsLeft && (
          <div className="flex items-center w-fit mx-auto gap-1 mb-4 justify-items-center">
            <ThumbnailUpload
              title="Test image A"
              showUpload={!hasNoCreditsLeft}
              fileId={fileId}
              onUploadComplete={(uploaded: UploadFileResponse[]) => {
                setFileId(
                  (uploaded[0].response as { storageId: string }).storageId
                );
              }}
              error={errors.fileId}
            />
          </div>
        )}

        <div className="flex justify-start">
          <Unauthenticated>
            <Button 
              className="mt-0 mb-4 mx-auto"
              onClick={() => signIn("google")}
            >
              Sign In to start
            </Button>
          </Unauthenticated>
          <Authenticated>
            <ActionButton
              disabled={!!user && hasNoCreditsLeft}
              isLoading={loading}
              className="mt-0 mb-4 mx-auto"
              type="submit"
            >
              Create a Poll (1 credit)
            </ActionButton>
          </Authenticated>
        </div>
        {!!user && hasNoCreditsLeft && !loading && (
          <Alert className="mb-4 max-w-lg mx-auto">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Out of Credits</AlertTitle>
            <AlertDescription className="text-left">
              No credits left to create a poll.{" "}
              <Button asChild className="p-0" variant="link">
                <Link href={Routes.upgrade()}>Upgrade</Link>
              </Button>{" "}
              to get more credits.
            </AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}
