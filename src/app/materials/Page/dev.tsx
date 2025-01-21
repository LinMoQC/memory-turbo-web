import { CommonComponentProps } from "@/types/editor";
import { useMaterailDrop } from "@/hooks/useMaterialDrop";


function Page({id,children,styles}: CommonComponentProps) {
    const {canDrop,drop} = useMaterailDrop(['Button','Container','Modal','Table','Form','FlexContainer'],id);

    return (
        <div className="p-[20px] h-[100%] box-border"
        data-component-id={id}
        ref={drop} style={{ border: canDrop ? '2px solid blue' : 'none' ,...styles}}>
            {children}
        </div>
    )
}

export default Page