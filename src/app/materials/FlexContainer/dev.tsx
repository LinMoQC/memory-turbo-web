'use client'
import { CommonComponentProps } from "@/types/editor";
import { useMaterailDrop } from "@/hooks/useMaterialDrop";
import React, { useEffect, useMemo, useRef } from "react";
import { useDrag } from "react-dnd";


interface FlexContainerProps extends CommonComponentProps {
    
}

const FlexContainer: React.FC<FlexContainerProps> = (props) => {
    const {id, name, children, styles} = props
    const { canDrop, drop } = useMaterailDrop(['FlexItem'], id);
    
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
                style={{ ...styles, marginTop: '-1px' }}
                className={
                    `min-h-[200px] p-[20px] relative flex items-center justify-between gap-8
                    ${isEmpty ? 'border-dashed bg-[rgba(10,19,37,.05)]' : 'bg-transparent border-0'}
                    ${canDrop ? 'border-[2px] border-[blue]' : 'border-[2px] border-[#ced0d3]'}`
                }
            >
                {isEmpty 
                    ? Array(3).fill(null).map((_, index) => <ContainerItem key={index} />) 
                    : children}
            </div>
        );
};

const ContainerItem = () => {
    return (
        <div className={
            `min-h-[200px] p-[20px] relative flex items-center justify-center flex-1
            border-dashed bg-[rgba(10,19,37,.05)]`
        }>
            <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-[#b8babf]">
                    内容区域
                </div>
        </div>
    )
}

export default FlexContainer;
