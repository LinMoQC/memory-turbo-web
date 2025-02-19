import HttpClient from "@/lib/http";
import { ForgetPasswordFormSchema, LoginFormSchema, RegisterFormSchema } from "@/lib/validate";
import { User } from "@/stores/role-info";
import { AuthFormState } from "@/types/auth";


// 登录action
export async function loginAction(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const validationFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    });

    if (!validationFields.success) {
        return {
            error: validationFields.error.flatten().fieldErrors
        };
    }

    const response = await HttpClient.post<any>(`/auth/login`, JSON.stringify(validationFields.data))

    if (response) {
        return {
            message: 'Login Success',
            token: response?.accessToken,
            info: response?.userInfo
        }
    }
}

// 忘记密码Action
export async function forgetAction(staet:AuthFormState, formData: FormData): Promise<AuthFormState> {
    const validationFields = ForgetPasswordFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        emailCode: formData.get('emailCode')
    });

    if (!validationFields.success) {
        return {
            error: validationFields.error.flatten().fieldErrors
        };
    }

    const response = await HttpClient.post<any>(`/auth/forget`, JSON.stringify(validationFields.data))

    if (response) {
        return {
            message: 'Success',
        }
    }
}

// github登录
export function githubLogin() {
    // 重定向到后端的 GitHub 登录授权页面
    window.location.href = 'http://localhost:5666/api/auth/github';
}

// 注册action
export async function registerAction(state: AuthFormState, formData: FormData): Promise<AuthFormState> {

    const validationFields = RegisterFormSchema.safeParse({
        email: formData.get('email'),
        username: formData.get('username'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        emailCode: formData.get('emailCode')
    });

    if (!validationFields.success) {
        return {
            error: validationFields.error.flatten().fieldErrors
        };
    }

    const response = await HttpClient.post<any>(`/auth/register`, JSON.stringify(validationFields.data))

    if (response) {
        return {
            message: 'Register Success',
        }
    }
}

// 获取验证码
export async function getMailCode(email: string) {
    try {
        const res = HttpClient.post<{ message: string }>('/auth/email-code', {
            email
        })
        return res
    } catch {
        throw new Error('获取失败')
    }
}

// 退出action
export async function clearCookies() {
    return await HttpClient.get('/auth/logout');
}

// 获取用户信息--info
export async function getInfo(): Promise<User> {
    return HttpClient.get('/user/info');
}