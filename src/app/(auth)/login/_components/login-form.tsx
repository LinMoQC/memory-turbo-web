'use client'

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Fragment, useActionState, useEffect } from "react"
import LocalStorageUtil from "@/lib/localStorageUtil"
import { useRouter } from "next/navigation"
import SubmitButton from "../../../../components/submit-button"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { githubLogin, loginAction } from "@/actions/auth.action"

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"form">) {
    const [state, action] = useActionState(loginAction, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state?.message) {
            toast.success(state.message)
        }

        if (state?.token) {
            LocalStorageUtil.setItem('accessToken', state.token);
            router.push('/proxy/dashboard');
        }
    }, [state, router]);

    return (
        <Fragment>
            <form className={cn("flex flex-col gap-6", className)} {...props} action={action}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Welcome to <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 
                            tracking-wider leading-tight italic text-nowrap">Memory Flow</span></h1>
                    <p className="text-balance text-sm text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>
                <div className="grid gap-6">

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" name="email" placeholder="m@example.com" required />
                    </div>

                    {state?.error && (
                        <p className="text-sm text-red-500">{state.error.email}</p>
                    )}

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <a
                                href="/forget"
                                className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                                Forgot your password?
                            </a>
                        </div>
                        <Input id="password" type="password" name="password" required />
                    </div>

                    {state?.error && (
                        <p className="text-sm text-red-500">{state.error?.password}</p>
                    )}

                    <SubmitButton>
                        Login
                    </SubmitButton>
                </div>
                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="underline underline-offset-4">
                        Sign up
                    </Link>
                </div>
            </form>
            <div className="relative mt-3 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                </span>
            </div>
            <Button variant="outline" className="w-full mt-3" onClick={githubLogin}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                        fill="currentColor"
                    />
                </svg>
                Login with GitHub
            </Button>
        </Fragment>
    )
}
