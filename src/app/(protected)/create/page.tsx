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
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "../../../../convex/_generated/api";
import { ThumbnailUpload } from "./thumbnail-upload";

interface FormData {
  title: string;
  fileId: string;
}

export default function CreatePage() {
  const { signIn } = useAuthActions();
  const user = useQuery(api.users.getCurrentUser);
  const { handleError } = useMutationErrorHandler();
  const uploadImage = useMutation(api.images.uploadImage);
  const router = useRouter();
  const creditsAvailable = useQuery(api.users.getAvailableCredits);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      fileId: "",
    },
  });

  const fileId = watch("fileId");

  // Register fileId field for validation
  register("fileId", {
    required: "Upload image please",
  });

  const hasNoCreditsLeft = creditsAvailable === 0;

  const onSubmit = async (data: FormData) => {
    try {
      const imageId = await uploadImage({
        fileId: data.fileId,
        title: data.title,
      });
      toast({
        title: "Test created!",
      });
      router.push(Routes.imageWithId(imageId));
    } catch (error) {
      handleError(error);
    }
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col max-w-(--breakpoint-sm) mb-8 mx-auto">
          <Label htmlFor="title" className="text-md">
            Your Test Title
          </Label>
          <Input
            id="title"
            type="text"
            className={clsx("text-lg", {
              "border-destructive border": errors.title,
            })}
            placeholder="Label your test to make it easier to manage later"
            {...register("title", {
              required: "Fill in the title please",
            })}
          />
          {errors.title && (
            <div className="text-destructive">{errors.title.message}</div>
          )}
        </div>
        {!hasNoCreditsLeft && (
          <div className="flex items-center w-fit mx-auto gap-1 mb-4 justify-items-center">
            <ThumbnailUpload
              title="Test image A"
              showUpload={!hasNoCreditsLeft}
              fileId={fileId}
              onUploadComplete={(uploaded: UploadFileResponse[]) => {
                setValue("fileId", (uploaded[0].response as { storageId: string }).storageId);
              }}
              error={errors.fileId?.message}
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
              isLoading={isSubmitting}
              className="mt-0 mb-4 mx-auto"
              type="submit"
            >
              Create a Poll (1 credit)
            </ActionButton>
          </Authenticated>
        </div>
        {!!user && hasNoCreditsLeft && !isSubmitting && (
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
