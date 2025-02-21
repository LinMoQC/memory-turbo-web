import HttpClient from "@/lib/http";
import { AdminInfo, UserFormState, UserInfo } from "@/types/user";

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
            role: Number(formData.get('role'))
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
        };
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

// 获取所有admin用户
export async function getAllAdminUser(): Promise<AdminInfo[]> {
    return await HttpClient.get(`/user/admin`)
}