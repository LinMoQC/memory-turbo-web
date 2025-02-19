import { deletUserByUsename } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserInfo } from "@/types/user";
import React, { useCallback, useTransition } from "react";
import toast from "react-hot-toast";

interface DeletDialogProps {
  isOpen: boolean;
  setOpen: (status: boolean) => void;
  user: UserInfo;
  initUserList: () => Promise<void>
}

const DeletDialog: React.FC<DeletDialogProps> = (props: DeletDialogProps) => {
  const { isOpen, setOpen, user, initUserList } = props
  const [isPending,startTransition] = useTransition()

  const handleSubmit = useCallback(() => {
    startTransition(async () => {
      const res = await deletUserByUsename(user.username)
      await initUserList()  
      if (res) toast.success(res.message)
      setOpen(false)
    })
  }, [user.username]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mr-auto">删除确认</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} disabled={isPending}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletDialog;
