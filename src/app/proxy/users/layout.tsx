import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Memory Flow - 用户管理',
}

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full h-full px-4">
            {children}
        </div>
    )
}