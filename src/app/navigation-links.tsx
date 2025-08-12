import { Routes } from "@/lib/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { Authenticated, useConvexAuth } from "convex/react";
import Link from "next/link";

export function NavigationLinks() {
  const { isLoading } = useConvexAuth();

  return (
    <div className="hidden md:flex md:items-center md:ml-20 lg:ml-20">
      <div className="flex items-center md:gap-6 lg:gap-12 text-sm sm:text-base md:text-lg lg:text-lg font-medium">
        {isLoading ? (
          <div className="flex items-center md:gap-6 lg:gap-12">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        ) : (
          <Authenticated>
            <Link
              href={Routes.collection()}
              className="hover:text-primary text-foreground transition-colors duration-100"
            >
              Collection
            </Link>
            <Link
              href={Routes.create()}
              className="hover:text-primary text-foreground transition-colors duration-100"
            >
              Create
            </Link>
          </Authenticated>
        )}
      </div>
    </div>
  );
}