'use client'
import { Segmented } from "antd";
import { useState } from "react";
import ComponentAttr from "./ComponentAttr";
import ComponentEvent from "./ComponentEvent";
import ComponentStyle from "./ComponentStyle";
import EmptyStatus from "../../../common/Empty";
import { useComponentsStore } from "@/stores/lowcode-materials";

const Setting: React.FC = () => {
    const { curComponent } = useComponentsStore();

    const [key, setKey] = useState<string>("属性");
    if (!curComponent) return <EmptyStatus
        description={'您还没有选中物料～'}
        width={200} height={200}
        className="ml-14"
    />

    return (
        <div className="mr-2 ml-2 mt-2 p-2 mb-2 rounded-lg shadow-lg pb-0 bg-white border-2 h-[calc(100vh-90px)] dark:bg-dark dark:text-dark">
            <Segmented value={key} onChange={setKey} block options={['属性', '样式', '事件']} size='large' />
            <div className="pt-10">
                {
                    key === '属性' && <ComponentAttr />
                }
                {
                    key === '样式' && <ComponentStyle />
                }
                {
                    key === '事件' && <ComponentEvent />
                }
            </div>
        </div>
    )
}

export default Setting