import { Alert, AlertDescription } from "@/components/ui/alert";
import { Routes } from "@/lib/routes";
import { InfoIcon } from "lucide-react";
import Link from "next/link";

export const Disclaimer = () => {
  return (
    <Alert className="mt-10 dark:bg-gray-800/10">
      <AlertDescription className="flex items-center">
        <InfoIcon className="size-5 mr-3" />
        <span>Please review our</span>
        <Link
          className="text-primary hover:text-primary/90"
          href={Routes.refundPolicyPage()}
        >
          &nbsp; Refund Policy &nbsp;
        </Link>
        before purchasing credits.
      </AlertDescription>
    </Alert>
  );
};
