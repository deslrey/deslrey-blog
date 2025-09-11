import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import "@ant-design/v5-patch-for-react-19";
import 'bytemd/dist/index.css';
import 'highlight.js/styles/github.css';
import '@/styles/global.scss';
import '@/styles/markdown/bytemd.scss'

import StyledComponentsRegistry from "@/lib/StyledComponentsRegistry";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import styles from "./layout.module.scss";
import classNames from "classnames";
import ColorProvider from "@/components/ColorProvider";

export const metadata: Metadata = {
    title: "deslrey",
    description: "deslrey 个人博客",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={classNames(styles.PageBox, styles.bg1)}>
                <StyledComponentsRegistry>
                    <AntdRegistry>
                        <ColorProvider>
                            <Nav />
                            {children}
                            <Footer />
                        </ColorProvider>
                    </AntdRegistry>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
