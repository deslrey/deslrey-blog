import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import styles from "./index.module.scss";
import BgSeriesToggle from "../BgSeriesToggle";
import type { RouteType } from "../../../interfaces/router";
import { useWebRoutes } from "../../../router/config";
import ThemeToggle from "../ThemeToggle.tsx";

const NavItem: React.FC<{ item: RouteType }> = ({ item }) => {
    const location = useLocation();
    const isActive = location.pathname === item.path;

    return (
        <Link
            to={item.path}
            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
        >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            <span className={styles.title}>{item.title}</span>
        </Link>
    );
};

const Nav: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const hideThreshold = 100;
    const showThreshold = 10;
    const hideTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const diff = currentScrollY - lastScrollY.current;

                    // 向下滚动且超过200px时隐藏
                    if (diff > 0 && currentScrollY > hideThreshold) {
                        if (visible) {
                            if (hideTimeout.current) clearTimeout(hideTimeout.current);
                            hideTimeout.current = setTimeout(() => {
                                setVisible(false);
                            }, 100); // 延迟一点再隐藏
                        }
                    }
                    // 向上滚动超过100px则显示
                    else if (diff < 0 && lastScrollY.current - currentScrollY > showThreshold) {
                        if (!visible) {
                            setVisible(true);
                        }
                    }

                    lastScrollY.current = currentScrollY;
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (hideTimeout.current) clearTimeout(hideTimeout.current);
        };
    }, [visible]);

    return (
        <nav
            className={`
                ${styles.NavWrapper}
                ${scrollY > 200 ? styles.scrolled : ""}
                ${visible ? styles.visible : styles.hidden}
            `}
        >
            <div className={styles.NavMain}>
                {useWebRoutes().map((item) => (
                    <NavItem key={item.path} item={item} />
                ))}
                <ThemeToggle />
                <BgSeriesToggle />
            </div>
        </nav>
    );
};

export default Nav;
