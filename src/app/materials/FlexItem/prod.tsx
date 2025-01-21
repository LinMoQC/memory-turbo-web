import { CommonComponentProps } from "@/types/editor";
import React from "react";


interface FlexItemProps extends CommonComponentProps {
    flexRatio: number
}

const FlexItem: React.FC<FlexItemProps> = (props) => {
    const { children, styles,flexRatio } = props
    return (
        <div
            style={{ ...styles,flex: `${flexRatio}`}}
            className={
                `min-h-[200px] p-[20px] relative`
            }
        >
            {children}
        </div>
    );
};

export default FlexItem;
