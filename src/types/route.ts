import { Roles } from "@memory/shared";

export interface RouteConfig {
  path: string;       // 路由路径
  role_id: Roles;  // 角色权限
  name?: string;   // 路由名称
  icon?: string;   // 图标
}
