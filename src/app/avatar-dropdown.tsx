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

interface Props {
  fullName: string | null | undefined;
  imageUrl: string | undefined;
  email: string | undefined;
}

export const AvatarDropdown = ({ fullName, email, imageUrl }: Props) => {
  const { signOut } = useAuthActions();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete My Data",
    "Are you sure you want to delete your data?",
    "destructive"
  );
  const nameAcronym =
    fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("") ?? "";

  const deleteMyData = () => {
    void confirm().then((confirmed) => {
      if (confirmed) {
        console.log("deleting data");
      } else {
        console.log("doing nothing");
      }
    });
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
            className="px-8 py-3 cursor-pointer"
          >
            <TriangleAlert className="mr-2 h-4 w-4 text-destructive" />
            <span className="ml-5 text-destructive">Delete My Data</span>
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
