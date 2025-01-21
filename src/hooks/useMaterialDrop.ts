import { useDrop } from "react-dnd";
import { getComponentById, useComponentsStore } from "@/stores/lowcode-materials";
import { useComponentConfigStore } from "@/stores/lowcode-materials-config";
import toast from "react-hot-toast";

export interface ItemType {
    type: string;
    dragType?: 'move' | 'add',
    id: string
}

export function useMaterailDrop(accept: string[], id: string) {
    const { addComponent, deleteComponent, components } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore();

    const [{ canDrop }, drop] = useDrop(() => ({
        accept: accept,
        drop: (item: ItemType, monitor) => {
            const didDrop = monitor.didDrop()
            if (didDrop) {
                return;
            }

            if (item.dragType === 'move') {
                const component = getComponentById(item.id, components)!;
                deleteComponent(item.id);
                addComponent(component, id)
            } else {
                const config = componentConfig[item.type];
                addComponent({
                    id: `${item.type}_${new Date().getTime()}`,
                    name: item.type,
                    props: config.defaultProps,
                    desc: config.desc,
                }, id)
                toast.success(`成功拖拽 ${item.type} 到画布`)
            }
        },
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
        }),
    }));

    return { canDrop, drop }
}