"use client";

import LoadingIndicator from "@/components/loading-indicator";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

export default function DashboardPage() {
  const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser);

  if (!thumbnails) {
    return <LoadingIndicator className="mt-40" />;
  }

  return (
    <div className="mx-auto max-w-screen-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
      {thumbnails?.map((thumbnail) => (
        <div
          key={thumbnail._id}
          className="relative group overflow-hidden rounded-lg"
        >
          <Image
            src={thumbnail.aImageUrl!}
            alt={thumbnail.title}
            width={400}
            height={400}
            className="w-full h-auto object-cover transition-transform duration-300"
          />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-black bg-opacity-60 transition-all opacity-100 group-hover:opacity-100">
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-start justify-end h-full">
              <h3 className="text-white text-xl font-semibold mb-2 line-clamp-1">
                <p>{thumbnail.title}</p>
              </h3>
              <div className="flex justify-between w-full">
                <Button
                  asChild
                  variant="secondary"
                  className="min-w-40"
                  size="sm"
                >
                  <Link href={`/thumbnails/${thumbnail._id}`}>View</Link>
                </Button>
                <p className="text-background dark:text-white">
                  Votes: {thumbnail.aVotes + thumbnail.bVotes}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
