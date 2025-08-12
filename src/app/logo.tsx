import { Constants } from "@/constants";
import { PackageIcon } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 hover:text-primary transition-colors duration-100 ${className || ""}`}
    >
      <PackageIcon className="size-7" />
      <span className="text-base font-semibold sm:text-lg md:text-xl lg:text-xl">
        {Constants.APP_NAME}
      </span>
    </Link>
  );
}
