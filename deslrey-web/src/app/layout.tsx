import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import "@ant-design/v5-patch-for-react-19";

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
            <body>
                <AntdRegistry>{children}</AntdRegistry>
            </body>
        </html>
    );
}
