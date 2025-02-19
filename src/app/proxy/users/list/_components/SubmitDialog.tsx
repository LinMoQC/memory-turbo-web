import RoleSelect from "@/app/proxy/_components/roleSelect";
import UserStatusSelect from "@/app/proxy/_components/userStatusSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Roles, UserStatusEnum } from "@memory/shared";
import { UserInfo } from "@/types/user";
import React, { useState, useCallback, useEffect, useTransition } from "react";
import toast from "react-hot-toast";
import { updateUserByName } from "@/actions/user.action";

interface SubmitDialogProps {
  isOpen: boolean;
  setOpen: (status: boolean) => void;
  user: UserInfo;
  initUserList: () => Promise<void>
}

const SubmitDialog: React.FC<SubmitDialogProps> = (props: SubmitDialogProps) => {
  const { isOpen, setOpen, user, initUserList } = props;

  // 初始化表单字段
  const [formData, setFormData] = useState({
    avatar: user.avatar,
    username: user.username,
    email: user.email
  });

  const [curStatus, setCurStatus] = useState<UserStatusEnum>(user.status);
  const [curRole, setCurRole] = useState<Roles>(user.role_id);
  
  const [isPending, startTransition] = useTransition();

  // 检查是否有字段变化
  const isFormChanged =
    formData.avatar !== user.avatar ||
    formData.username !== user.username ||
    formData.email !== user.email ||
    curStatus !== user.status ||
    curRole !== user.role_id;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = useCallback(async () => {
    if (!isFormChanged) return;

    const submitData = new FormData();
    submitData.append("avatar", formData.avatar as string);
    submitData.append("username", formData.username);
    submitData.append("email", formData.email);
    submitData.append("role_id", curRole.toString());
    submitData.append("status", curStatus.toString());

    startTransition(async () => {
      const {success,message} = await updateUserByName(submitData)
      setOpen(false);
      if(success) toast.success(message)
      else toast.error(message)  
      await initUserList()  
    });

    await initUserList(); 
  }, [formData, curRole, curStatus, isFormChanged, setOpen, initUserList]);

  useEffect(() => {
    setFormData({
      avatar: user.avatar,
      username: user.username,
      email: user.email
    });
    setCurStatus(user.status);
    setCurRole(user.role_id);
  }, [user, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">

              <Label htmlFor="username" className="text-right">
                头像
              </Label>
              <Input
                id="avatar"
                name="avatar"
                value={formData.avatar || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />

              <Label htmlFor="username" className="text-right">
                用户名
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username || ""}
                onChange={handleInputChange}
                placeholder="请输入用户名"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                邮箱
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                placeholder="请输入邮箱"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                角色
              </Label>
              <RoleSelect select={setCurRole} role={curRole} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role_id" className="text-right">
                状态
              </Label>
              <UserStatusSelect select={setCurStatus} status={curStatus} />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button
            onClick={() => setOpen(false)}
            className="mr-2"
            color="red"
            type="button"
          >
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !isFormChanged}>
            {isPending ? "保存中..." : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitDialog;
