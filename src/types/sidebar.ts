import { UserRole } from "@/stores/role-info";
import { LucideIcon } from "lucide-react";

interface SubMenuItem {
  title: string;   // 子菜单标题
  url: string;     // 子菜单链接
  role_id?: UserRole;      // 不填默认父级角色权限，填写需大于父级权限
}

export interface SideBarMenuItem {
  title: string;          // 菜单标题
  url: string;            // 菜单链接
  icon?: LucideIcon;      // 图标（可选）
  isActive?: boolean;     // 是否激活（可选）
  role_id: UserRole;      // 角色权限
  items?: SubMenuItem[];  // 子菜单列表（可选）
}
