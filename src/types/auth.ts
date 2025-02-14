export type AuthFormState = {
    error?: {
        username?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        emailCode?: string[]
    };
    message?: string;
    token?: string;
    info?: any; 
} | undefined;