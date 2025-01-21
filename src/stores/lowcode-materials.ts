import { CSSProperties } from "react";
import { create, StateCreator } from "zustand";
import { persist } from 'zustand/middleware';

export interface ComponentSetter {
    name: string;
    label: string;
    type: string;
    [key: string]: any;
}

export interface Component {
    id: string;
    name: string;
    props: any;
    children?: Component[];
    setter?: ComponentSetter;
    parentId?: string;
    desc: string;
    styles?: CSSProperties;
}

interface State {
    components: Component[];
    curComponentId?: string | null;
    curComponent: Component | null;
    mode: 'edit' | 'preview'
}

interface Action {
    addComponent: (component: Component, parentId?: string) => void;
    deleteComponent: (componentId: string) => void;
    updateComponent: (componentId: string, props: any) => void;
    setCurComponentId: (componentId: string) => void;
    updateComponentStyles: (componentId: string, styles: CSSProperties, replace?: boolean) => void
    setMode: (mode: State['mode']) => void;
}

const creator: StateCreator<State & Action> = (set, get) => ({
    components: [
        {
            id: 'root',
            name: 'Page',
            props: {},
            desc: '页面'
        }
    ],
    curComponent: null,
    curComponentId: null,
    mode: 'edit',
    setMode: (mode) => set({ mode }),
    setCurComponentId: (componentId) => {
        set((state) => ({
            curComponentId: componentId,
            curComponent: componentId !== null ? getComponentById(componentId, state.components) : null
        }))
    },
    addComponent: (component, parentId) => {
        set((state) => {
            if (parentId) {
                const parentComponent = getComponentById(
                    parentId,
                    state.components
                );

                if (parentComponent) {
                    if (parentComponent.children) {
                        parentComponent.children.push(component);
                    } else {
                        parentComponent.children = [component];
                    }

                    component.parentId = parentId;
                    return { components: [...state.components] };
                }
            }
            return { components: [...state.components, component] };
        });
    },
    deleteComponent: (componentId) => {
        if (!componentId) return;

        const component = getComponentById(componentId, get().components);
        if (component?.parentId) {
            const parentComponent = getComponentById(
                component.parentId,
                get().components
            );

            if (parentComponent) {
                parentComponent.children = parentComponent?.children?.filter(
                    (item) => item.id !== componentId
                )
            }

            set({ components: [...get().components] });
        }
    },
    updateComponent: (componentId, props) => {
        set((state) => {
            const component = getComponentById(componentId, state.components);
            if (component) {
                component.props = { ...component.props, ...props };

                return { components: [...state.components] };
            }

            return { components: [...state.components] };
        })
    },
    updateComponentStyles: (componentId, styles, replace) =>
        set((state) => {
            const component = getComponentById(componentId, state.components)
            if (component) {
                component.styles = replace ? { ...styles } : { ...component.styles, ...styles }
                return { components: [...state.components] }
            }

            return { components: [...state.components] };
        })
})

export const useComponentsStore = create<State & Action>()(persist(creator, {
    name: 'lowcode'
}));

export function getComponentById(
    id: string,
    components: Component[]
): Component | null {
    if (!id) return null;

    for (const component of components) {
        if (component.id === id) {
            return component;
        }

        if (component.children && component.children.length > 0) {
            const child = getComponentById(id, component.children);
            if (child) return child;
        }
    }

    return null
}