'use client'

import React, { useActionState, useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import SubmitButton from "@/components/submit-button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getMailCode, registerAction } from "@/lib/action"; // 发送验证码的 action
import { Button } from "@/components/ui/button";
import { debounce } from "lodash-es";
import confetti from 'canvas-confetti'

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [state, action] = useActionState(registerAction, undefined);
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  // 用来保存邮箱验证码发送状态（例如倒计时等）
  const [sendCountdown, setSendCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  // 监听状态变化
  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);
      confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: 0.6 }
      });
      router.push("/login");
    }
  }, [state, router]);

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // 使用 useMemo 创建稳定的防抖函数
  const debouncedSetEmail = useMemo(
    () =>
      debounce((value: string) => {
        setEmail(value);
      }, 500),
    []
  );

  // 点击发送验证码按钮的处理函数
  const sendCode = useCallback(async () => {
    if (!email) {
      toast.error("请输入有效的邮箱");
      return;
    }
    if (isSending || sendCountdown > 0) return;
    setIsSending(true);
    try {
      const res = await getMailCode(email);
      setSendCountdown(60)
      if(res) toast.success(res.message)
    } catch (error) {
        toast.error('获取失败')
        console.error(error)
    } finally {
      setIsSending(false);
    }
  }, [email, isSending, sendCountdown]);

  // 倒计时逻辑：每秒减少1
  useEffect(() => {
    if (sendCountdown <= 0) return;
    const timer = setInterval(() => {
      setSendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [sendCountdown]);

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} action={action}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your details below to create a new account
        </p>
      </div>
      <div className="grid gap-6">
        {/* Email 输入框 */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="m@example.com"
            required
            onChange={(e) => debouncedSetEmail(e.currentTarget.value)}
          />
        </div>

        {/* 如果有 error，显示邮箱错误提示 */}
        {state?.error && (
          <p className="text-sm text-red-500">{state.error.email}</p>
        )}

        {/* Username */}
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" name="username" placeholder="Your username" required />
        </div>
        {state?.error && (
          <p className="text-sm text-red-500">{state.error?.username}</p>
        )}

        {/* Password */}
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" name="password" required />
        </div>
        {state?.error && (
          <p className="text-sm text-red-500">{state.error?.password}</p>
        )}

        {/* Confirm Password */}
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input id="confirm-password" type="password" name="confirmPassword" required />
        </div>
        {state?.error && (
          <p className="text-sm text-red-500">{state.error?.confirmPassword}</p>
        )}

        {/* Email Code 与发送验证码 */}
        <div className="grid gap-2">
          <Label htmlFor="email-code">Email Code</Label>
          <div className="flex gap-2">
            <Input id="email-code" type="text" name="emailCode" required />
            <Button onClick={sendCode} disabled={isSending || sendCountdown > 0}>
              {sendCountdown > 0 ? `${sendCountdown}s` : "Send"}
            </Button>
          </div>
        </div>
        {state?.error && (
          <p className="text-sm text-red-500">{state.error?.emailCode}</p>
        )}

        <SubmitButton>Register</SubmitButton>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}
