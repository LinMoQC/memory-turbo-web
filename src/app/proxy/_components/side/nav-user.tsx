import {
    BadgeCheck,
    ChevronsUpDown,
    LogOut,
} from "lucide-react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import LocalStorageUtil from "@/lib/localStorageUtil";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { User, useUserStore } from "@/stores/role-info";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertDialogAction, AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { clearCookies } from "@/lib/action";
import { Button } from "@/components/ui/button";

// 定义组件时，使用 props 来接收 user
export function NavUser({ user }: { user: User }) {
    const { isMobile } = useSidebar();
    const router = useRouter();
    const { resetUser } = useUserStore()

    const [openDialog, setOpenDialog] = useState(false); // 管理对话框的打开状态

    const logout = async () => {
        // 清理 localStorage
        LocalStorageUtil.removeItem('accessToken');
        LocalStorageUtil.removeItem('info');
        // 后端清理cookie
        await clearCookies()
        toast.success('Logout Success');
        router.push('/login');
        // 清理全局状态
        resetUser()
    };

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        setOpenDialog(true); 
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.avatar ?? undefined} alt={user.username} />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user.username}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.avatar ?? undefined} alt={user.username} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user.username}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogoutClick}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>

            {/* 这里是对话框 */}
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>退出确认</AlertDialogTitle>
                        <AlertDialogDescription>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-black px-3 rounded-sm py-1 text-white">取消</AlertDialogCancel>
                        <AlertDialogAction onClick={logout} className="font-sm bg-black px-3 rounded-sm py-1 text-white">确认</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </SidebarMenu>
    );
}
