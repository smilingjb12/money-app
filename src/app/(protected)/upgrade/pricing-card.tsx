import { Button } from "@/components/ui/button";
import { useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";

export const PricingCard = ({
  iconGenerator,
  title,
  description,
  credits,
  stripePriceId,
}: {
  title?: string;
  description: string;
  iconGenerator: () => React.ReactNode;
  credits: number;
  stripePriceId: string;
}) => {
  const router = useRouter();
  const pay = useAction(api.stripe.pay);
  const handleUpgradeClick = async () => {
    const url = await pay({ stripePriceId });
    router.push(url!);
  };
  return (
    <div className="flex flex-col p-6 mx-auto lg:min-w-full max-w-lg text-center text-foreground bg-card rounded-lg border border-border shadow-sm xl:p-8">
      {title && <h3 className="mb-4 text-2xl font-semibold">{title}</h3>}
      <div className="flex justify-center mt-4">{iconGenerator()}</div>
      <div className="flex justify-center items-baseline mt-8 mb-2">
        <span className="mr-2 text-3xl font-bold">{credits} Credits</span>
      </div>
      <p className="font-light text-muted-foreground sm:text-lg mb-8">
        {description}
      </p>
      <Button
        onClick={handleUpgradeClick}
        className="bg-primary hover:bg-primary/90 focus:ring-4 focus:ring-primary/30 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-primary-foreground"
      >
        Purchase
      </Button>
    </div>
  );
};
