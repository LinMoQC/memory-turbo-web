import { z } from "zod";

// 注册表单校验
export const RegisterFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .trim(),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .trim(),
  confirmPassword: z
    .string()
    .trim(),
    emailCode: z.string().length(6, { message: "Email code must be exactly 6 characters long" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// 登录表单校验
export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter valid email address" }).trim(),
  password: z.string()
    .min(1, { message: "Password must not be empty" })
})

// LowCode提交表单校验
export const LowCodeFormSchema = z.object({
  template_name: z.string()
    .min(1, { message: '模版名称不能为空' })
    .trim(),
  template_json: z.string()
    .refine((val) => {
      try {
        const parsed = JSON.parse(val);
        return parsed[0].children.length > 0;
      } catch {
        return false;
      }
    }, { message: '模版JSON不能为空' })
});


// 忘记密码表单校验
export const ForgetPasswordFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .trim(),
  confirmPassword: z
    .string()
    .trim(),
    emailCode: z.string().length(6, { message: "Email code must be exactly 6 characters long" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});