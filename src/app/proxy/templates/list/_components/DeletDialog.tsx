import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useInit from "@/hooks/useInit";
import { deleteLowCodeProjectById } from "@/lib/action";
import React, { useCallback, useTransition } from "react";
import toast from "react-hot-toast";

interface DeletDialogProps {
  isOpen: boolean;
  setOpen: (status: boolean) => void;
  templateKey: string;
}

const DeletDialog: React.FC<DeletDialogProps> = (props: DeletDialogProps) => {
  const { isOpen, setOpen, templateKey } = props
  const {initTemplateList} = useInit()
  const [isPending,startTransition] = useTransition()

  const handleSubmit = useCallback(() => {
    startTransition(async () => {
      const info = await deleteLowCodeProjectById(templateKey)
      await initTemplateList()
      if (info) toast.success('删除成功')
      setOpen(false)
    })
  }, [templateKey]);

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
