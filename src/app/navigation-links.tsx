import { Routes } from "@/lib/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { Authenticated, useConvexAuth } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavigationLinks() {
  const { isLoading } = useConvexAuth();
  const pathname = usePathname();

  const navigationItems = [
    { href: Routes.collection(), label: "Collection" },
    { href: Routes.create(), label: "Create" },
  ];

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
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-foreground transition-colors duration-100 py-2 px-3 border-b-2 border-transparent hover:border-foreground",
                  pathname === item.href && "border-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </Authenticated>
        )}
      </div>
    </div>
  );
}