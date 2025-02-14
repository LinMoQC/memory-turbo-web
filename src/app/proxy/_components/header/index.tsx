'use client'

import ModeToggle from "@/app/common/ThemeButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React, { Fragment, useEffect, useMemo } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import LowCodeStatus from "@/components/lowcode-status-button";
import LowCodeSave from "@/components/lowcode-save-button";
import WS from "@/lib/websocket";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import useInit from "@/hooks/useInit";

const Header: React.FC = () => {
    const location = usePathname();
    const { toast } = useToast()
    const router = useRouter()
    const { initTemplateList } = useInit()

    const isLowCode = useMemo(() => {
        return location.includes('/proxy/templates/create');
    }, [location]);

    // const [socket, setSocket] = useState<Socket | null>(null);
    // const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        // 连接成功时的回调
        WS.connect()

        // 监听审批请求消息事件
        WS.onMessage('requst-message', (data) => {
            console.log('收到 WebSocket 消息:', data);
            toast({
                title: data,
                action: (
                    <ToastAction altText="Goto schedule to undo" onClick={() => router.push('/proxy/templates/review')}>Go</ToastAction>
                ),
            })
        });

        // 监听审批请求消息事件
        WS.onMessage('template-change-message', async (data) => {
            console.log('收到 WebSocket 消息:', data);
            toast({
                title: data,
            })
            await initTemplateList()
        });
        return () => {
            WS.disconnect()
        }
    }, []);

    const pathSegments = location.split('/').filter(segment => segment);
    const breadcrumbItems = pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        console.log(path)
        if(index === 0) return (
            <Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem>
                    <Link href={'/proxy/dashboard'}>
                        {'Dashboard'}
                    </Link>
                </BreadcrumbItem>
            </Fragment>
        )

        if(path === '/proxy/dashboard') return null

        if(index === 1) return (
            <Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem>
                    {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </BreadcrumbItem>
            </Fragment>
        )

        return (
            <Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem>
                    <Link href={path}>
                        {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </Link>
                </BreadcrumbItem>
            </Fragment>
        );
    });

    return (
        <header className="flex h-16 shrink-0 justify-between pr-4 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbItems}
                        <BreadcrumbSeparator className="hidden md:block" />
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex gap-2 items-center">
                {isLowCode && <LowCodeStatus />}
                {isLowCode && <LowCodeSave />}
                <ModeToggle />
            </div>
        </header>
    );
}

export default Header;
