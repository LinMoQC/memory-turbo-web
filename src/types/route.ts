import { UserRole } from "@/stores/role-info";

export interface RouteConfig {
  path: string;       // 路由路径
  role_id: UserRole;  // 角色权限
  name?: string;   // 路由名称
  icon?: string;   // 图标
}
