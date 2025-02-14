import { UserRole } from "@/stores/role-info";
import { RouteConfig } from "@/types/route";

export const Routes: RouteConfig[] = [
  // 仪表盘
  {
    path: '/proxy/dashboard',
    role_id: UserRole.public, 
  },
  // 模版管理
  {
    path: '/proxy/templates',
    role_id: UserRole.public, 
  },
  {
    path: '/proxy/templates/list',
    role_id: UserRole.public, 
  },
  {
    path: '/proxy/templates/create',
    role_id: UserRole.public,  
  },
  {
    path: '/proxy/templates/review',
    role_id: UserRole.admin
  },
  {
    path: '/proxy/workflows',
    role_id: UserRole.public, 
  },
  {
    path: '/proxy/workflows/list',
    role_id: UserRole.public, 
  },
  {
    path: '/proxy/workflows/create',
    role_id: UserRole.public,
  },
  // 用户管理
  {
    path: '/proxy/users',
    role_id: UserRole.admin, 
  },
  {
    path: '/proxy/users/list',
    role_id: UserRole.admin, 
  },
  {
    path: '/proxy/users/roles',
    role_id: UserRole.admin, 
  },
  {
    path: '/proxy/users/permissions',
    role_id: UserRole.admin,  
  },
  {
    path: '/proxy/users/logs',
    role_id: UserRole.admin,  
  },
  // 消息通知
  {
    path: '/proxy/notifications',
    role_id: UserRole.public
  }
];
