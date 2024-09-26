"use client";

import { SignInButton, SignOutButton, useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const { isSignedIn } = useSession();
  const createThumbnail = useMutation(api.thumbnails.createThumbnail);
  const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser);
  return (
    <>
      {isSignedIn && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const title = formData.get("title") as string;
            await createThumbnail({ title });
            e.currentTarget?.reset();
          }}
        >
          <label>Title</label>
          <input name="title" type="text" className="text-black" />
          <button type="submit">Create</button>
        </form>
      )}
      <h1 className="text-2xl font-bold">Thumbnails:</h1>
      {thumbnails?.map((thumbnail, index) => (
        <div key={thumbnail._id}>
          {index + 1}. {thumbnail.title}
        </div>
      ))}
    </>
  );
}
