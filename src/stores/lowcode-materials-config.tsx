import { ButtonConfig } from "@/app/materials/Button";
import { ContainerConfig } from "@/app/materials/Container";
import { FlexContainerConfig } from "@/app/materials/FlexContainer";
import { FlexItemConfig } from "@/app/materials/FlexItem";
import { FormConfig } from "@/app/materials/Form";
import { FormItemConfig } from "@/app/materials/FormItem";
import { ModalConfig } from "@/app/materials/Modal";
import { PageConfig } from "@/app/materials/Page";
import { TableConfig } from "@/app/materials/Table";
import { TableColumnConfig } from "@/app/materials/TableColumn";
import { create } from "zustand";
import { ComponentSetter } from "./lowcode-materials";

// 物料类型
export type MaterialType = 'unit' | 'area' | 'special'

export interface ComponentConfig {
    name: string;
    defaultProps: Record<string, any>;
    setter?: ComponentSetter[]
    desc: string;
    stylesSetter?: ComponentSetter[];
    dev: any;
    prod: any;
    events?: ComponentEvent[]
    methods?: ComponentMethod[],
    materialType: MaterialType,
}

// 组件事件
export interface ComponentEvent {
    name: string;
    label: string
}

export interface ComponentMethod {
    name: string;
    label: string
}

interface State {
    componentConfig: { [key: string]: ComponentConfig }
}

interface Action {
    registerComponent: (name: string, componentConfig: ComponentConfig) => void;
}

export const useComponentConfigStore = create<State & Action>((set) => ({
    componentConfig: {
        Container: ContainerConfig,
        Button: ButtonConfig,
        Page: PageConfig,
        Modal: ModalConfig,
        Table: TableConfig,
        TableColumn: TableColumnConfig,
        FormItem: FormItemConfig,
        FlexContainer: FlexContainerConfig,
        FlexItem: FlexItemConfig,
        Form: FormConfig
    },
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