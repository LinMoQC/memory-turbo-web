import { redirect } from "next/navigation";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // 项目已经初始化
    if(process.env.INITIALIZED === 'true') {
            return redirect('/login')
    }

    return (
        <div className="w-full min-h-svh flex items-center justify-center">
            {children}
        </div>
    )
}