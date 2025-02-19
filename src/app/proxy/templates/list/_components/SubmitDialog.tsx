import { requestApproval } from "@/actions/lowcode.action";
import UserSelect from "@/app/proxy/_components/userSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useInit from "@/hooks/useInit";
import React, { useState, useCallback, useEffect, useActionState, useTransition } from "react";

interface SubmitDialogProps {
  isOpen: boolean;
  setOpen: (status: boolean) => void;
  templateKey: string;
}

const SubmitDialog: React.FC<SubmitDialogProps> = (props: SubmitDialogProps) => {
  const { isOpen, setOpen, templateKey } = props
  const [approver, setApprover] = useState("");
  const [state, action] = useActionState(requestApproval, undefined);
  const {initTemplateList} = useInit()
  const [isPending,startTransition] = useTransition()

  useEffect(() => {
    if (state?.success) {
      startTransition(async () => {
        initTemplateList()
      })
    }
  }, [state, setOpen]);

  const handleSubmit = useCallback(() => {
    if (!approver) return; 

    const formData = new FormData();
    formData.append("approver", approver);
    formData.append("template_key", templateKey);

    startTransition(() => {
      action(formData);
      setOpen(false);
    })
  }, [approver, templateKey, action]);

  useEffect(() => {
    if (!isOpen) {
      setApprover(""); 
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Template Review</DialogTitle>
        </DialogHeader>
        <UserSelect select={setApprover} />
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!approver || isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitDialog;
