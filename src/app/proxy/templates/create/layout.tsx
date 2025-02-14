import { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
    title: 'Memory Flow - 创建模版',
}

export default function EditorLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Fragment>
            { children }
        </Fragment>
    )
}