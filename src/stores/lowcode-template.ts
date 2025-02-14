import { LowCodeTemplateType } from "@/types/editor";
import { create } from "zustand";

export interface LowCodeProject {
    template_name: string;
}

export const useLowCodeTemplateStore = create<{
  curTemplate: LowCodeProject | null;
  setTemplateTitle: (template: LowCodeProject) => void;
  resetTemplateTitle: () => void;
  templateList: LowCodeTemplateType[] | [];
  setTemplateList: (list: LowCodeTemplateType[]) => void;
}>((set) => ({
  curTemplate: null,
  setTemplateTitle: (title: LowCodeProject) => set({ curTemplate: title }),
  resetTemplateTitle: () => set({ curTemplate: null }),
  templateList: [], 
  setTemplateList: (list: LowCodeTemplateType[]) => set({ templateList: list }), 
}));
