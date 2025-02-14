import { CSSProperties, PropsWithChildren } from "react";

export interface CommonComponentProps extends PropsWithChildren {
    id: string;
    name: string;
    [key: string]: any;
    styles?: CSSProperties
}

type LowCodeTemplateStatus = 'draft' | 'review' | 'approved' | 'rejected';

export interface LowCodeTemplateType {
    id: number;
    username: string;
    template_name: string | null;
    template_json: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    status: LowCodeTemplateStatus;
    template_key: string;
}

export type LowCodeFormState = {
    error?: {
        template_name?: string[];
        template_json?: string[];
    };
    message?: string;
} | undefined;

export type TemplateApproveState = {
    error?: {
    };
    success: boolean
    message?: any;
} | undefined;