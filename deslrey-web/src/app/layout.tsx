// RootLayout.tsx （服务器组件，不加 'use client'）
import type { Metadata } from "next";
import 'bytemd/dist/index.css';
import 'highlight.js/styles/github.css';
import '@/styles/global.scss';
import '@/styles/base.scss';
import '@/styles/markdown/bytemd.scss';

import StyledComponentsRegistry from "@/lib/StyledComponentsRegistry";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";
import ClientAppLayout from "./ClientAppLayout";
import BgSeriesProvider from "@/components/BgSeriesProvider";

export const metadata: Metadata = {
    title: "deslrey",
    description: "deslrey 个人博客",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <StyledComponentsRegistry>
                    <ThemeProvider>
                        <BgSeriesProvider>
                            <ClientAppLayout>
                                {children}
                            </ClientAppLayout>
                        </BgSeriesProvider>
                    </ThemeProvider>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
