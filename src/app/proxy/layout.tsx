import React from "react";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import AppSidebar from "./_components/side";
import Header from "./_components/header";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Memory Flow',
    keywords: ['lowcode','next','nest'],
    description: '企业级低代码解决方案'
}

export default function ProxyLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Header />
                {children}
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    )
}