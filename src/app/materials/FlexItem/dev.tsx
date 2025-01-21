'use client'
import { CommonComponentProps } from "@/types/editor";
import { useMaterailDrop } from "@/hooks/useMaterialDrop";
import React, { useEffect, useMemo, useRef } from "react";
import { useDrag } from "react-dnd";

interface FlexItemProps extends CommonComponentProps {
    flexRatio: number
}

const FlexItem: React.FC<FlexItemProps> = (props) => {
    const { id, name, children, styles, flexRatio } = props
    const { canDrop, drop } = useMaterailDrop(['Button', 'Container', 'Table', 'Form'], id);

    const divRef = useRef<HTMLDivElement>(null)
    const [_, drag] = useDrag({
        type: name,
        item: {
            type: name,
            dragType: 'move',
            id: id,
        }
    })

    useEffect(() => {
        drop(divRef);
        drag(divRef);
    }, []);

    const isEmpty = useMemo(() => {
        return Array.isArray(children) && children.length === 0
    }, [children])

    return (
        <div
            ref={divRef}
            data-component-id={id}
            style={{ ...styles, marginTop: '-1px', flex: `${flexRatio}` }}
            className={`min-h-[200px] p-[20px] relative
                border-dashed bg-[rgba(10,19,37,.05)]
                transition-all duration-100 ease-in-out
                ${isEmpty ? 'border-dashed bg-[rgba(10,19,37,.05)]' : 'bg-transparent border-0'}
                ${canDrop ? 'border-[2px] border-[blue]' : 'border-[2px] border-[#ced0d3]'}
    `}>
            {isEmpty ? (
                <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-[#b8babf]">
                    内容区域
                </div>
            ) : (
                children
            )}
        </div>
    );
};

export default FlexItem;
