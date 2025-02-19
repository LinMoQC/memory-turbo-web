import HttpClient from "@/lib/http";

// 获取所有权限角色（Admin）
export async function getRoles(): Promise<Role[]> {
    return HttpClient.get('/role/all')
}