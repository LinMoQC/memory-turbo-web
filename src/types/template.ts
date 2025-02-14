import { templateStatus } from "@/constants/templateSatus";

interface User {
    email: string;
    avatar: string;
}

export interface LowcodeTemplate {
    id: number;
    template_name: string;
    template_json: string;
    created_at: Date;
    updated_at: Date;
    username: string;
    status: templateStatus;
    template_key: string;
    user: User;
}

export interface LowCodeApproveState {
    success: boolean;
    message: string | unknown;
    error?: object;
  }