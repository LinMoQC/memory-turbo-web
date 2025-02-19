import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'Welcome to Memory Flow',
}

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // 项目没有初始化
    if(process.env.INITIALIZED === 'false') {
        return redirect('/initialize')
    }
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
                    <div className="relative hidden bg-muted lg:block">
                        <img
                            src="/login-pic.jpg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2]"
                        />
                    </div>
                    <div className="flex flex-col gap-4 p-6 md:p-10 w-full">
                        <div className="flex justify-center gap-2 md:justify-start">
                            <a href="#" className="flex items-center gap-2 font-medium">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <h2>MF</h2>
                                    </div>
                                    <h2 className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 
                            tracking-wider leading-tight italic text-nowrap'>
                                        Memory Flow
                                    </h2>
                            </a>
                        </div>
                        <div className="flex flex-1 items-center justify-center">
                            <div className="w-full max-w-xs">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
    )
}