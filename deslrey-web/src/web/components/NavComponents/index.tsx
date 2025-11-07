import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import styles from "./index.module.scss";
import BgSeriesToggle from "../BgSeriesToggle";
import type { RouteType } from "../../../interfaces/router";
import { useWebRoutes } from "../../../router/config";
import Checkbox from "../Checkbox/idnex";
import ThemeToggle from "../ThemeToggle.tsx";

const NavItem: React.FC<{ item: RouteType; onClick?: () => void }> = ({
    item,
    onClick,
}) => {
    const location = useLocation();
    const isActive = location.pathname === item.path;

    console.log('location ======> ', location)

    return (
        <Link
            to={item.path}
            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            onClick={onClick}
        >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            <span className={styles.title}>{item.title}</span>
        </Link>
    );
};

const Nav: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [scrolly, setScrollY] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const navMainRef = useRef<HTMLDivElement>(null);
    const refRef = useRef<number | null>(null);

    const navRoutes = useWebRoutes();

    // 判断是否移动端
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 监听滚动
    useEffect(() => {
        const handleScroll = () => {
            if (refRef.current) cancelAnimationFrame(refRef.current);
            refRef.current = requestAnimationFrame(() => {
                if (!isMobile) setScrollY(window.scrollY);
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        setScrollY(window.scrollY);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (refRef.current) cancelAnimationFrame(refRef.current);
        };
    }, [isMobile]);

    return (
        <nav
            className={`${styles.NavWrapper} ${!isMobile && scrolly > 200 ? styles.scrolled : ""
                }`}
        >
            {/* 移动端汉堡按钮 */}
            <div className={styles.mobileToggle}>
                <Checkbox open={open} onToggle={setOpen} />
            </div>

            {/* 背景遮罩层 */}
            {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

            <div
                ref={navMainRef}
                className={`${styles.NavMain} ${open ? styles.open : ""
                    } ${!isMobile && scrolly > 200 ? styles.scrolled : ""}`}
            >
                {navRoutes.map((item) => (
                    <NavItem
                        key={item.path}
                        item={item}
                        onClick={() => setOpen(false)}
                    />
                ))}

                <ThemeToggle />
                <BgSeriesToggle />
            </div>
        </nav>
    );
};

export default Nav;
