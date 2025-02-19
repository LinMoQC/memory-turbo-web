import HttpClient from "@/lib/http";
import LocalStorageUtil from "@/lib/localStorageUtil";
import { LowCodeFormSchema } from "@/lib/validate";
import { User } from "@/stores/role-info";
import { LowCodeFormState, LowCodeTemplateType, TemplateApproveState } from "@/types/editor";
import { LowcodeTemplate } from "@/types/template";
import toast from "react-hot-toast";

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