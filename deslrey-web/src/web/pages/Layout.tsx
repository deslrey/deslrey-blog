import { useEffect, useState } from "react";
import { useTheme } from "../components/ThemeProvider";
import { useBgSeries } from "../components/BgSeriesProvider";
import { api } from "../api";
import request from "../../utils/reques";
import styles from './index.module.scss'
import ColorProvider from "../components/ColorProvider";
import Nav from "../components/NavComponents";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    const { series } = useBgSeries();
    const [bgUrl, setBgUrl] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const getBg = async () => {
            try {
                let res;

                if (series === 'scenery') {
                    res = await request.get(api.carouselPage.scenery);
                } else if (series === 'sex') {
                    res = await request.get(api.carouselPage.sex);
                }

                if (res && res.code === 200) {
                    setBgUrl(res.data);
                } else {
                    // 如果是纯色模式，不加载图像
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
    }, [series]);

    useEffect(() => {
        if (!bgUrl) {
            setLoaded(true);
            return;
        }

        const img = new Image();
        img.src = bgUrl;
        img.onload = () => setLoaded(true);
    }, [bgUrl]);

    return (
        <div
            className={`${styles.PageBox} ${loaded ? styles.loaded : ''} ${series === 'pure' ? styles.pure : ''}`}
            style={{
                '--bg-url': bgUrl ? `url(${bgUrl})` : 'none'
            } as React.CSSProperties}
        >
            <ColorProvider>
                <Nav />
                {children}
            </ColorProvider>
        </div>
    );
}
