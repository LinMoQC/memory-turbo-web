import {create} from "zustand/index";
import {MaterialConfigs} from "@cusmoedge/lowcode-materials";
import { LowCodeConfigAction, LowCodeConfigState } from "@cusmoedge/lowcode-editor";

export const useLowCodeConfigStore = create<LowCodeConfigState & LowCodeConfigAction>((set) => ({
    componentConfig: MaterialConfigs,
    registerComponent: (name, componentConfig) => set((state) => {
        return {
            ...state,
            componentConfig: {
                ...state.componentConfig,
                [name]: componentConfig
            }
        }
    })
}));