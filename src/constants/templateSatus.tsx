import { Clock, Check, X, UserCheck } from 'lucide-react';

// 状态的枚举
export enum templateStatus {
  DRAFT = "draft",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export const templateStatusRender = {
  [templateStatus.DRAFT]: {
    label: '待提交',
    textColor: '#6B7280', 
    bgColor: '#E5E7EB',  
    icon: Clock,
  },
  [templateStatus.PENDING]: {
    label: "待审批",
    textColor: "#C27D0B", 
    bgColor: "#FDE68A",  
    icon: UserCheck,
  },
  [templateStatus.APPROVED]: {
    label: "已通过",
    textColor: "#166534", 
    bgColor: "#86EFAC",  
    icon: Check,
  },
  [templateStatus.REJECTED]: {
    label: "已拒绝",
    textColor: "#B91C1C",  
    bgColor: "#FECACA",  
    icon: X,
  },
};
