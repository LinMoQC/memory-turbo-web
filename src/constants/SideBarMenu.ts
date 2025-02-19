import { SideBarMenuItem } from "@/types/sidebar";
import { Roles } from "@memory/shared";
import { BellRing, LayoutDashboard, Repeat, SquareTerminal, User2 } from "lucide-react";

export const SideBarMenu: SideBarMenuItem[] = [
    {
        title: "仪表盘",
        url: "/proxy/dashboard",  
        icon: LayoutDashboard,
        isActive: true,
        role_id: Roles.public
    },
    {
        title: "模版管理",
        url: "/proxy/templates",  
        icon: SquareTerminal,
        role_id: Roles.public,
        items: [
            {
                title: "模版列表",
                url: "/proxy/templates/list",  
            },
            {
                title: "模版审核",
                url:  "/proxy/templates/review", 
                role_id: Roles.admin
            }
        ],
    },
    {
        title: "工作流管理",
        url: "/proxy/workflows",  
        icon: Repeat,
        role_id: Roles.public,
        items: [
            {
                title: "流程列表",
                url: "/proxy/workflows/list",  
            },
            {
                title: "创建流程",
                url: "/proxy/workflows/create",  
            },
        ],
    },
    {
        title: "用户管理",
        url: "/proxy/users", 
        icon: User2,
        role_id: Roles.admin,
        items: [
            {
                title: "用户列表",
                url: "/proxy/users/list", 
            },
            {
                title: "角色管理",
                url: "/proxy/users/roles", 
                role_id: Roles.super
            },
            {
                title: "权限配置",
                url: "/proxy/users/permissions",  
                role_id: Roles.super
            },
            {
                title: "操作日志",
                url: "/proxy/users/logs", 
                role_id: Roles.super
            },
        ],
    },
    {
        title: "消息通知",
        url: "/proxy/notifications",  
        icon: BellRing,
        isActive: true,
        role_id: Roles.public
    }
];
