import { useEffect, useState } from "react";
import { useTheme } from "../components/ThemeProvider";
import { useBgSeries } from "../components/BgSeriesProvider";
import { api } from "../api";
import request from "../../utils/reques";
import styles from './index.module.scss'
import ColorProvider from "../components/ColorProvider";
import Nav from "../components/NavComponents";
import TitleSyncComponent from "../components/TitleSyncComponent";
import MobileNav from "../components/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    const { series } = useBgSeries();
    const [bgUrl, setBgUrl] = useState('');
    const [loaded, setLoaded] = useState(false);

    const [isMobile, setIsMobile] = useState(false);


    useEffect(() => {
        const getBg = async () => {
            try {
                let res;

                // if (series === "sex") {
                //     const loliRes = await fetch("https://www.loliapi.com/acg/");
                //     if (loliRes.ok && loliRes.url) {
                //         setBgUrl(loliRes.url);
                //     } else {
                //         setBgUrl(theme === 'dark' ? '/images/bg0.webp' : '/images/bg1.webp');
                //     }

                //     return;
                // } else if (series === 'scenery') {
                //     res = await request.get(api.carouselPage.scenery);
                // }

                // else 
                if (series === 'sex') {
                    res = await request.get(api.carouselPage.sex);
                }

                if (res && res.code === 200) {
                    setBgUrl(res.data);
                } else {
                    if (series === 'pure') {
                        setBgUrl('');
                    } else {
                        setBgUrl(theme === 'dark' ? '/images/bg0.webp' : '/images/bg1.webp');
                    }
                }
            } catch (error) {
                if (series === 'pure') {
                    setBgUrl('');
                } else {
                    setBgUrl(theme === 'dark' ? '/images/bg0.webp' : '/images/bg1.webp');
                }
            }
        };

        getBg();
    }, [series, isMobile]);

    useEffect(() => {
        if (!bgUrl) {
            setLoaded(true);
            return;
        }

        const img = new Image();
        img.src = bgUrl;
        img.onload = () => setLoaded(true);
    }, [bgUrl]);


    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div
            className={`${styles.PageBox} ${loaded ? styles.loaded : ''} ${series === 'pure' ? styles.pure : ''}`}
            style={{
                '--bg-url': bgUrl ? `url(${bgUrl})` : 'none'
            } as React.CSSProperties}
        >
            <ColorProvider>
                <TitleSyncComponent />
                {isMobile ? <MobileNav /> : <Nav />}
                {children}
            </ColorProvider>
        </div>
    );
}
