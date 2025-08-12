import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut, TriangleAlert } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "@/hooks/use-toast";
import { api } from "../../convex/_generated/api";

interface Props {
  fullName: string | null | undefined;
  imageUrl: string | undefined;
  email: string | undefined;
}

export const AvatarDropdown = ({ fullName, email, imageUrl }: Props) => {
  const { signOut } = useAuthActions();
  const deleteUserDataMutation = useMutation(api.users.deleteUserData);

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete My Data (GDPR)",
    `This will permanently delete your personal information including name, email, phone, profile image, and application data. Your credits balance and purchase history will be retained for fraud prevention and legal compliance. This action cannot be undone.`,
    "destructive"
  );

  const nameAcronym =
    fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("") ?? "";

  const deleteMyData = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;

    try {
      const result = await deleteUserDataMutation();

      toast({
        title: "Data Deleted",
        description: result?.message ?? "Your data has been deleted successfully",
      });

      // Automatically sign out user after data deletion
      await signOut();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete data",
      });
    }
  };

  const ProfileImage = () => {
    return (
      <Avatar className="size-9 cursor-pointer">
        <AvatarImage src={imageUrl} alt={fullName ?? nameAcronym} />
        <AvatarFallback className="bg-primary">{nameAcronym}</AvatarFallback>
      </Avatar>
    );
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{ProfileImage()}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[340px] pb-4">
          <div className="flex flex-row px-5 py-5 gap-x-4">
            <div>{ProfileImage()}</div>
            <div>
              <div className="text-sm">{fullName}</div>
              <div className="text-[13px]">{email}</div>
            </div>
          </div>
          <DropdownMenuItem
            onClick={deleteMyData}
            className="px-8 py-3 cursor-pointer hover:bg-warning/15 focus:bg-warning/15"
          >
            <TriangleAlert className="mr-2 h-4 w-4 text-warning" />
            <span className="ml-5 text-warning font-medium">Delete My Data</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => signOut()}
            className="px-8 py-3 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="ml-5">Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
