'use client'

import React, { Suspense, useEffect, useState } from "react";
import { useLowCodeTemplateStore } from "@/stores/lowcode-template";
import { initComponents, useLowCodeStore } from "@/stores/lowcode-store";
import { useLowCodeConfigStore } from "@/stores/lowcode-config-store";
import '@cusmoedge/lowcode-editor/index.css';
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { getLowCodeById } from "@/lib/action";
import { cloneDeep, isEqual } from "lodash-es";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EditorSkeleton from "../_components/EditorSkeleton";

const LowCodeEditor = dynamic(() => import("@cusmoedge/lowcode-editor").then(mod => mod.default), { ssr: false });
const LowCodeStoreProvider = dynamic(() => import("@cusmoedge/lowcode-editor").then(mod => mod.LowCodeStoreProvider), { ssr: false });
const LowCodeConfigStoreProvider = dynamic(() => import("@cusmoedge/lowcode-editor").then(mod => mod.LowCodeConfigStoreProvider), { ssr: false });

export default function Page() {
    const { resetTemplateTitle, setTemplateTitle } = useLowCodeTemplateStore();
    const { setAllComponents, setCurComponentId, components } = useLowCodeStore();
    const [originalData, _] = useState(cloneDeep(components));
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [isLoading,setLoading] = useState(true)

    useEffect(() => {
        setHasUnsavedChanges(!isEqual(components, originalData));
    }, [components, originalData]);

    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault()
                window.confirm('模版已更新但没有保存，是否需要存储为草稿？')
            }
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [hasUnsavedChanges]);

    const searchParams = useSearchParams();
    const templateKey = searchParams.get('template_key');

    useEffect(() => {
        if (templateKey) {
            init();
        }
    }, [templateKey]);

    const init = async () => {
        if (templateKey) {
            const components = await getLowCodeById(templateKey);
            if (components && components.template_json && components.template_name) {
                setAllComponents(JSON.parse(components.template_json));
                setTemplateTitle({ template_name: components.template_name });
            }
        }
    };

    useEffect(() => {
        initEditor();
    }, []);

    const initEditor = () => {
        setAllComponents(JSON.parse(JSON.stringify(initComponents)));
        setCurComponentId('');
        resetTemplateTitle();
        setLoading(false)
    };

    if(isLoading) return <EditorSkeleton />

    return (
        <Suspense fallback={<EditorSkeleton />}>
            <DndProvider backend={HTML5Backend}>
            <div className="h-full flex flex-col">
                <LowCodeStoreProvider store={useLowCodeStore}>
                    <LowCodeConfigStoreProvider store={useLowCodeConfigStore}>
                        <LowCodeEditor />
                    </LowCodeConfigStoreProvider>
                </LowCodeStoreProvider>
            </div>
        </DndProvider>
        </Suspense>
    );
}
