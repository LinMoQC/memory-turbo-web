'use client'

import { FaRegEdit } from "react-icons/fa";

import { VscOpenPreview } from "react-icons/vsc";
import { Button } from "./ui/button";
import { useLowCodeStore } from "@/stores/lowcode-store";

const LowCodeStatus: React.FC = () => {
    const { mode, setMode, setCurComponentId } = useLowCodeStore();
    return (
        <>
            {mode === 'edit' && (
                <Button
                    onClick={() => {
                        setMode('preview');
                        setCurComponentId('');
                    }}
                >
                    <VscOpenPreview />
                    预览
                </Button>
            )}
            {mode === 'preview' && (
                <Button
                    onClick={() => setMode('edit')}
                    color="purple"
                >
                    <FaRegEdit />
                    编辑
                </Button>
            )}
        </>
    )
}

export default LowCodeStatus