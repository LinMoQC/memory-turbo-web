import HttpClient from "@/lib/http";
import { RegisterFormSchema } from "@/lib/validate";
import { AuthFormState } from "@/types/auth";

// 初始化action,用于创建一个超级管理员账号
export async function initializeAction(state: AuthFormState, formData: FormData) {
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

    const response = await HttpClient.post<any>(`/auth/init`, JSON.stringify(validationFields.data))

    if (response) {
        return {
            message: 'Register Success',
        }
    }
}