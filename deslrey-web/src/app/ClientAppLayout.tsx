'use client';

import { useTheme } from "@/components/ThemeProvider/ThemeProvider";
import Nav from "@/components/Nav";
import ColorProvider from "@/components/ColorProvider";
import Footer from "@/components/Footer";
import styles from "./layout.module.scss";
import classNames from "classnames";

export default function ClientAppLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    return (
        <div className={classNames(styles.PageBox, theme === 'dark' ? styles.bg0 : styles.bg1)}>
            <ColorProvider>
                <Nav />
                {children}
                {/* <Footer /> */}
            </ColorProvider>
        </div>
    );
}
