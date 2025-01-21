import MonacoEditor, { OnMount } from '@monaco-editor/react'
import React, { Fragment } from "react";

import Loading from '../../../common/Loading';
import { useComponentsStore } from '@/stores/lowcode-materials';

const Source: React.FC = () => {
    const { components } = useComponentsStore();

    const handleEditorMount: OnMount = (editor, monaco) => {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
            editor.getAction('editor.action.formatDocument')?.run()
        });
    }
    return <MonacoEditor
        height={'100%'}
        path='components.json'
        loading={<Fragment>
            <Loading />
        </Fragment>}
        language='json'
        onMount={handleEditorMount}
        value={JSON.stringify(components, null, 2)}
        // onChange={(value) => {console.log(value)}}
        options={
            {
                fontSize: 14,
                scrollBeyondLastLine: false,
                minimap: {
                    enabled: false,
                },
                scrollbar: {
                    verticalScrollbarSize: 6,
                    horizontalScrollbarSize: 6,
                },
                readOnly: true
            }
        }
    />
}

export default Source