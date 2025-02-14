import { create, StateCreator } from "zustand";
import { produce } from "immer";
import { LowCodeState, LowCodeAction, LowCodeComponent } from '@cusmoedge/lowcode-editor'

export const initComponents = [
    {
        id: 'root',
        name: 'Page',
        props: {},
        desc: '页面'
    }
]

interface CustomAction {
    setAllComponents: (components: LowCodeComponent[]) => void
}

const creator: StateCreator<LowCodeState & LowCodeAction & CustomAction> = (set, get) => {
    const getComponentById = (id: string, components: LowCodeComponent[]): LowCodeComponent | null => {
        if (!id) return null;
        for (const component of components) {
            if (component.id === id) return component;
            if (component.children?.length) {
                const child = getComponentById(id, component.children);
                if (child) return child;
            }
        }
        return null;
    };

    return {
        components: initComponents,
        curComponent: null,
        curComponentId: null,
        mode: 'edit',

        setMode: (mode) => set({ mode }),
        
        setCurComponentId: (componentId) => set(produce(state => {
            state.curComponentId = componentId;
            state.curComponent = componentId 
                ? getComponentById(componentId, state.components)
                : null;
        })),

        addComponent: (component, parentId) => set(produce(state => {
            if (parentId) {
                const parent = getComponentById(parentId, state.components);
                if (parent) {
                    parent.children = parent.children || [];
                    parent.children.push({ ...component, parentId });
                }
            } else {
                state.components.push(component);
            }
        })),

        deleteComponent: (componentId) => set(produce(state => {
            const component = getComponentById(componentId, state.components);
            if (!component?.parentId) return;

            const parent = getComponentById(component.parentId, state.components);
            if (parent?.children) {
                parent.children = parent.children.filter(c => c.id !== componentId);
            }
        })),

        updateComponent: (componentId, props) => set(produce(state => {
            const component = getComponentById(componentId, state.components);
            if (component) {
                component.props = { ...component.props, ...props };
            }
        })),

        updateComponentStyles: (componentId, styles, replace) => set(produce(state => {
            const component = getComponentById(componentId, state.components);
            if (component) {
                component.styles = replace 
                    ? styles 
                    : { ...component.styles, ...styles };
            }
        })),

        getComponentById,
        
        setAllComponents: (components) => set(produce(state => {
            state.components = components;
        }))
    };
};

export const useLowCodeStore = create<LowCodeState & LowCodeAction & CustomAction>()(creator);