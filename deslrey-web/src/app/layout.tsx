import type { Metadata } from "next";

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
            <body>{children}</body>
        </html>
    );
}
