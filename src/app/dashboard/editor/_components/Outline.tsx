import React from "react";

import { Tree } from "antd";
import { useComponentsStore } from "@/stores/lowcode-materials";

const Outline:React.FC = () => {
    const {components,setCurComponentId} = useComponentsStore()
    return (
        <Tree 
        fieldNames={{ title: 'desc', key: 'id' }}
        treeData={components as any}
        showLine
        defaultExpandAll
        onSelect={([selectedKey]) => {
            setCurComponentId(selectedKey as string);
        }}
        />
    )
}

export default Outline