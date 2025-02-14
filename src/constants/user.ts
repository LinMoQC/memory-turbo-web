import { Ban, CheckCircle,User, Crown  } from "lucide-react";
import { Roles, UserStatusEnum } from "@memory/shared";

export const RolesRender = {
    [Roles.public]: {
        label: "普通用户",
        textColor: "#374151", 
        bgColor: "#E5E7EB",   
        icon: User,           
    },
    [Roles.admin]: {
        label: "管理员",
        textColor: "#1E40AF",  
        bgColor: "#BFDBFE",    
        icon: Crown,           
    },
};


export const UserStatusRender = {
    [UserStatusEnum.DISABLED]: {
        label: '禁用',
        textColor: "#B91C1C", 
        bgColor: "#FECACA",   
        icon: Ban
    },
    [UserStatusEnum.ACTIVE]: {
        label: '正常',
        textColor: "#166534",  
        bgColor: "#86EFAC",    
        icon: CheckCircle
    }
}
