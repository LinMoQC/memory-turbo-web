import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useId } from "react";
import Badge from "../badge/Badge";
import { Roles } from "@memory/shared";
import { RolesRender } from "@/constants/user";

interface RoleSelectProps {
  select: (role: Roles) => void;
  role: Roles;
}

export default function RoleSelect({ select, role }: RoleSelectProps) {
  const id = useId();

  // 过滤出 Roles 枚举中的角色项
  const roleOptions = Object.entries(Roles).filter(([key, value]) =>
    isNaN(Number(key))
  );

  // 处理角色变化
  const handleChange = (value: string) => {
    const selectedRole = Number(value) as Roles;
    select(selectedRole);
  };

  return (
    <div className="space-y-2 min-w-[280px]">
      <Select onValueChange={handleChange} value={String(role)}>
        <SelectTrigger
          id={id}
          className="h-auto ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0"
        >
          <SelectValue placeholder="选择角色" className="text-slate-700" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
          {roleOptions.map(([key, value]) => (
            <SelectItem value={String(value)} key={key}>
              <Badge {...RolesRender[value as Roles]} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
