import { CommonComponentProps } from "@/types/editor";
import React from "react";


interface FlexContainerProps extends CommonComponentProps {
    
}

const FlexContainer: React.FC<FlexContainerProps> = (props) => {
    const { children, styles} = props

    return (
        <div
            style={{ ...styles}}
            className={
                `min-h-[200px] p-[20px] relative flex items-center justify-between gap-8`
            }
        >
            {children}
        </div>
    );
};

export default FlexContainer;
