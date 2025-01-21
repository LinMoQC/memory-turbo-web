import { LayoutDashboard, Repeat, SquareTerminal, User2 } from "lucide-react";

const SideBarMenu = [
    {
        title: "仪表盘",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
    },
    {
        title: "项目管理",
        url: "",
        icon: SquareTerminal,
        items: [
            {
                title: "我的项目",
                url: "#",
            },
            {
                title: "新建项目",
                url: "dashboard/editor",
            },
        ],
    },
    {
        title: "工作流管理",
        url: "#",
        icon: Repeat,
        items: [
            {
                title: "流程列表",
                url: "/workflows",
            },
            {
                title: "创建流程",
                url: "/workflows/new",
            },
        ],
    },
    {
        title: "用户管理",
        url: "#",
        icon: User2,
        items: [
            {
                title: "用户列表",
                url: "/user/list",
            },
            {
                title: "角色管理",
                url: "/user/roles",
            },
            {
                title: "权限配置",
                url: "/user/permissions",
            },
            {
                title: "操作日志",
                url: "/user/logs",
            },
        ],
    },
]

export {
    SideBarMenu
}