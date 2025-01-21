'use client'

import React, { Fragment, Suspense, lazy } from "react";
import { Allotment } from "allotment";
import 'allotment/dist/style.css';
import { useComponentsStore } from "@/stores/lowcode-materials";
import Loading from "../loading";

// 懒加载组件
const MaterialWrapper = lazy(() => import("./_components/MaterialWrapper"));
const EditArea = lazy(() => import("./_components/EditArea"));
const Setting = lazy(() => import("./_components/Setting"));
const Preview = lazy(() => import("./_components/Preview"));

interface EditorProps {}

const Editor: React.FC<EditorProps> = () => {
    const { mode } = useComponentsStore();

    return (
        <Fragment>
            <div style={{ display: mode === 'edit' ? 'block' : 'none', height: '100%' }}>
                <Suspense fallback={<Loading />}>
                    <Allotment separator={false}>
                        <Allotment.Pane preferredSize={320} maxSize={320} minSize={320} >
                            <MaterialWrapper />
                        </Allotment.Pane>
                        <Allotment.Pane>
                            <EditArea />
                        </Allotment.Pane>
                        <Allotment.Pane preferredSize={300} maxSize={300} minSize={300}>
                            <Setting />
                        </Allotment.Pane>
                    </Allotment>
                </Suspense>
            </div>

            <div style={{ display: mode === 'preview' ? 'block' : 'none', height: '100%' }}>
                <Suspense fallback={<div>Loading...</div>}>
                    <Preview />
                </Suspense>
            </div>
        </Fragment>
    );
}

export default Editor;
