import { RouteConfig } from "@/types/route";
import { Roles } from "@memory/shared";

export const Routes: RouteConfig[] = [
  // 仪表盘
  {
    path: '/proxy/dashboard',
    role_id: Roles.public, 
  },
  // 模版管理
  {
    path: '/proxy/templates',
    role_id: Roles.public, 
  },
  {
    path: '/proxy/templates/list',
    role_id: Roles.public, 
  },
  {
    path: '/proxy/templates/create',
    role_id: Roles.public,  
  },
  {
    path: '/proxy/templates/review',
    role_id: Roles.admin
  },
  {
    path: '/proxy/workflows',
    role_id: Roles.public, 
  },
  {
    path: '/proxy/workflows/list',
    role_id: Roles.public, 
  },
  {
    path: '/proxy/workflows/create',
    role_id: Roles.public,
  },
  // 用户管理
  {
    path: '/proxy/users',
    role_id: Roles.admin, 
  },
  {
    path: '/proxy/users/list',
    role_id: Roles.admin, 
  },
  {
    path: '/proxy/users/roles',
    role_id: Roles.super, 
  },
  {
    path: '/proxy/users/permissions',
    role_id: Roles.super,  
  },
  {
    path: '/proxy/users/logs',
    role_id: Roles.super,  
  },
  // 消息通知
  {
    path: '/proxy/notifications',
    role_id: Roles.public
  }
];
