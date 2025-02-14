import { create } from 'zustand';

export enum UserRole {
    public = 1,
    admin = 2
}

// 定义用户信息类型
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar: string | null;
  role: number;
}

// 创建 Zustand store
export const useUserStore = create<{
  user: User | null;  
  setUser: (user: User) => void;
  resetUser: () => void;
}>((set) => ({
  user: null, // 初始值为 null
  setUser: (user: User) => set({ user }),
  resetUser: () => set({ user: null }), // 还原为 null
}));
