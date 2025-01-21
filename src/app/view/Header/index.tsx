'use client'

import ModeToggle from "@/app/common/ThemeButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React, { Fragment, useMemo } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation";
import { useComponentsStore } from "@/stores/lowcode-materials";
import { FaRegEdit } from "react-icons/fa";
import { Button } from "antd";
import { VscOpenPreview } from "react-icons/vsc";

const Header: React.FC = () => {
    const location = usePathname();
    const { mode, setMode, setCurComponentId } = useComponentsStore();

    const isLowCode = useMemo(() => {
        return location === '/dashboard/editor';
    }, [location]);

    // 切割路径并生成面包屑项
    const pathSegments = location.split('/').filter(segment => segment);
    const breadcrumbItems = pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        return (
            <Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem>
                    <BreadcrumbLink href={path}>
                        {segment.charAt(0).toUpperCase() + segment.slice(1)} {/* 首字母大写 */}
                    </BreadcrumbLink>
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
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="/">
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        {breadcrumbItems}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex gap-2 items-center">
                {isLowCode && (
                    <>
                        {mode === 'edit' && (
                            <Button
                                onClick={() => {
                                    setMode('preview');
                                    setCurComponentId('');
                                }}
                                variant="filled"
                                color="primary"
                                icon={<VscOpenPreview />}
                            >
                                预览
                            </Button>
                        )}
                        {mode === 'preview' && (
                            <Button
                                onClick={() => setMode('edit')}
                                variant="filled"
                                color="purple"
                                icon={<FaRegEdit />}
                            >
                                编辑
                            </Button>
                        )}
                    </>
                )}
                <ModeToggle />
            </div>
        </header>
    );
}

export default Header;
