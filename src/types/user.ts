import { Roles, UserStatusEnum } from "@memory/shared";

export interface AdminInfo {
    username: string;
    email: string;
    avatar: string;
}

export interface UserInfo {
    username: string;         // 用户名
    avatar: string | null;    // 头像URL，可能为null
    email: string;            // 邮箱
    role_id: Roles;           // 用户权限
    status: UserStatusEnum;       // 用户状态 (0: 禁用, 1: 正常)
    created_at: string;       // 创建时间 (ISO格式时间字符串)
    updated_at: string;       // 最后更新时间 (ISO格式时间字符串)
}

export interface UserFormState {
    success: boolean;
    message: string;
    error?: object;
}