"use client"

import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { SideBarMenu } from "@/constants/sideBarMenu"
import { useUserStore } from "@/stores/role-info"
import { Fragment, useEffect, useMemo } from "react"
import LocalStorageUtil from "@/lib/localStorageUtil"
import { getInfo } from "@/actions/auth.action"
import { Roles } from "@memory/shared"

const AppSidebar = React.memo(({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const { user, setUser } = useUserStore();

    useEffect(() => {
        init()
    },[])

    async function init() {
        const info = await getInfo()
        LocalStorageUtil.setItem('info',info)
        if (!user) {
            setUser(info);
        }
    }

    const sideBarMenuRole = useMemo(() => {
        return SideBarMenu.filter((item) => {
          const isMainItemVisible = (user?.role || Roles.public) >= item.role_id;
      
          if (item.items) {
            item.items = item.items.filter((subItem) => {
              if(subItem.role_id && user?.role) return (user?.role) >= subItem.role_id;
              return subItem
            });
          }
      
          return isMainItemVisible || (item.items && item.items.length > 0);
        });
      }, [user]);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <h2>MF</h2>
                            </div>
                            <h2 className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 tracking-wider leading-tight italic text-nowrap'>
                                Memory Flow
                            </h2>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {user ? <NavMain items={sideBarMenuRole} /> : <NavMainSkeleton />}
            </SidebarContent>

            <SidebarFooter>
                {user ? <NavUser user={user} /> : <UserInfoSkeleton />}
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
});

const UserInfoSkeleton = () => (
    <Fragment>
        <div className="w-full mx-auto p-4 bg-transparent">
            <div className="animate-pulse flex items-center space-x-4">
                <div className="bg-gray-200 h-11 w-16 rounded-full"></div>
                <div className="space-y-3 w-full">
                    <div className="bg-gray-200 h-4 rounded-md w-full"></div>
                    <div className="bg-gray-200 h-4 rounded-md w-3/4"></div>
                </div>
            </div>
        </div>
    </Fragment>
);

const NavMainSkeleton = () => (
    <Fragment>
        <div className="w-full mx-auto p-4 bg-transparent mt-10">
            <div className="animate-pulse flex items-center space-x-4">
                <div className="space-y-3 w-full">
                    <div className="bg-gray-200 h-4 rounded-md w-1/2"></div>
                    <div className="bg-gray-200 h-4 rounded-md w-full"></div>
                    <div className="bg-gray-200 h-4 rounded-md w-full"></div>
                    <div className="bg-gray-200 h-4 rounded-md w-full"></div>
                    <div className="bg-gray-200 h-4 rounded-md w-full"></div>
                </div>
            </div>
        </div>
    </Fragment>
);

export default AppSidebar;