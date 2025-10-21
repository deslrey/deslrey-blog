'use client';

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider/ThemeProvider";
import Nav from "@/components/Nav";
import ColorProvider from "@/components/ColorProvider";
import styles from "./layout.module.scss";

export default function ClientAppLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    const [loaded, setLoaded] = useState(false);

    const bgUrl = theme === 'dark' ? '/images/bg0.webp' : '/images/bg1.webp';

    useEffect(() => {
        const img = new Image();
        img.src = bgUrl;
        img.onload = () => setLoaded(true);
    }, [bgUrl]);

    return (
        <div
            className={`${styles.PageBox} ${loaded ? styles.loaded : ''}`}
            style={{
                '--bg-url': `url(${bgUrl})`
            } as React.CSSProperties}
        >
            <ColorProvider>
                <Nav />
                {children}
            </ColorProvider>
        </div>
    );
}
