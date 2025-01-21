'use client'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function EditorLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="h-full flex flex-col">
                {children}
            </div>
        </DndProvider>
    )
}