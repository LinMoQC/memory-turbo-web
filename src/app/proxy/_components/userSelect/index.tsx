import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllAdminUser } from "@/lib/action";
import { AdminInfo } from "@/types/user";
import { useEffect, useId, useState } from "react";

interface UserSelectProps {
  select: (username: string) => void;
}

export default function UserSelect({ select }: UserSelectProps) {
  const id = useId();
  const [admins, setAdmins] = useState<AdminInfo[]>([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    async function init() {
      setLoading(true);
      const adminUsers = await getAllAdminUser();
      setAdmins(adminUsers);
      setLoading(false);
    }
    init();
  }, []);

  return (
    <div className="space-y-2 min-w-[300px]">
      <Select onValueChange={select}>
        <SelectTrigger
          id={id}
          className="h-auto ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0"
        >
          <SelectValue placeholder="选择一个审批人" className="text-slate-700" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
          {loading ? (
            <UserSelectSkeleton />
          ) : (
            admins.map((admin) => (
              <SelectItem value={admin.username} key={admin.username}>
                <span className="flex items-center gap-2">
                  <img
                    className="rounded-full"
                    src={admin.avatar}
                    alt={admin.username}
                    width={40}
                    height={40}
                  />
                  <span>
                    <span className="block font-medium">{admin.username}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {admin.email}
                    </span>
                  </span>
                </span>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

const UserSelectSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 p-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="flex items-center gap-3" key={index}>
          <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 w-24 rounded-md animate-pulse" />
            <div className="h-3 bg-gray-300 dark:bg-gray-600 w-32 rounded-md animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};
