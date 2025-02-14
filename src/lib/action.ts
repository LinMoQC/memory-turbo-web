import { ForgetPasswordFormSchema, LoginFormSchema, LowCodeFormSchema, RegisterFormSchema } from "./validate";
import HttpClient from "./http";
import { User } from "@/stores/role-info";
import { AuthFormState } from "@/types/auth";
import { LowCodeFormState, LowCodeTemplateType, TemplateApproveState } from "@/types/editor";
import LocalStorageUtil from "./localStorageUtil";
import { AdminInfo, UserFormState, UserInfo } from "@/types/user";
import { LowcodeTemplate } from "@/types/template";
import toast from "react-hot-toast";

// TODO: 拆分Action

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

// 提交低代码表单
export async function LowCodeSaveAction(state: LowCodeFormState, formData: FormData): Promise<LowCodeFormState> {
    const userInfo: User = LocalStorageUtil.getItem('info') as User
    const templateKey = formData.get('template_key')

    const validationFields = LowCodeFormSchema.safeParse({
        template_name: formData.get('template_name'),
        template_json: formData.get('template_json')
    });

    if (!validationFields.success) {
        return {
            error: validationFields.error.flatten().fieldErrors
        };
    }

    let response = null;

    if (templateKey) {
        response = await HttpClient.patch<any>(`/lowcode/${templateKey}`, {
            ...validationFields.data,
        });
    } else {
        response = await HttpClient.post<any>('/lowcode/save', {
            ...validationFields.data,
            username: userInfo.username
        });
    }

    if (response) {
        return {
            message: 'Save Success',
        }
    }
}

// 获取所有低代码项目
export async function getAllLowCode(): Promise<LowCodeTemplateType[]> {
    return await HttpClient.get('/lowcode/all');
}

// 删除指定低代码项目
export async function deleteLowCodeProjectById(key: string) {
    return await HttpClient.delete<any>(`/lowcode/delete/${key}`);
}

// 获取指定低代码项目
export async function getLowCodeById(templateKey: string): Promise<LowCodeTemplateType> {
    return await HttpClient.get(`/lowcode/${templateKey}`)
}

// 获取所有admin用户
export async function getAllAdminUser(): Promise<AdminInfo[]> {
    return await HttpClient.get(`/user/admin`)
}

// 获取所有待审批模版（Admin权限）
export async function getAllPendings(page: number): Promise<{ templates: LowcodeTemplate[], hasNext: boolean }> {
    return await HttpClient.post(`/lowcode/pendings?page=${page}&pageSize=5`)
}

// 请求审批
export async function requestApproval(state: TemplateApproveState, formData: FormData): Promise<TemplateApproveState> {
    try {
        const response = await HttpClient.post('/lowcode/request-approval', formData);
        return { ...state, success: true, message: response };
    } catch (error) {
        return { ...state, success: false, message: '流转失败' };
    }
}

// 审批通过（Admin权限）
export async function approveRequest(templateKey: string) {
    try {
        const response = await HttpClient.post('/lowcode/approve-request', {
            templateKey
        }) as string;
        toast.success(response)
    } catch (error) {
        toast.success('流转失败');
    }
}

// 审批失败（Admin权限）
export async function rejectRequest(templateKey: string) {
    try {
        const response = await HttpClient.post('/lowcode/reject-request', {
            templateKey
        }) as string;
        toast.success(response);
    } catch (error) {
        toast.success('流转失败');
    }
}

// 获取所有用户（Admin）
export async function getUsers(): Promise<UserInfo[]> {
    return HttpClient.get('/user/all')
}

// 更新指定用户
export async function updateUserByName(
    formData: FormData
): Promise<UserFormState> {
    try {
        const response = await HttpClient.post<{ msg: string }>(`/user/${formData.get('username')}`, {
            username: formData.get('username'),
            email: formData.get('email'),
            avatar: formData.get('avatar'),
            status: Number(formData.get('status')),
            role_id: Number(formData.get('role_id'))
        });

        return {
            success: true,
            message: response.msg,
        };
    } catch (error) {
        console.error("更新用户信息时发生错误:", error);
        return {
            success: false,
            message: '更新失败',
        }; // 返回失败的状态
    }
}


// 删除指定用户
export async function deletUserByUsename(username: string): Promise<UserFormState> {
    try {
        await HttpClient.delete(`/user/${username}`)
        return { success: true, message: '删除成功' };
    } catch (error) {
        return { success: false, message: '删除失败' };
    }
}

// 获取所有权限角色（Admin）
export async function getRoles(): Promise<Role[]> {
    return HttpClient.get('/role/all')
}