"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./index.module.scss";
import SysIcon from "../SysIcon";
import { NavObj, NavList } from "./config";
import Link from "next/link";
import Checkbox from "../Checkbox";
import { usePathname } from "next/navigation";
import BlogTitle from "../BlogTitle";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import BgSeriesToggle from "../BgSeriesToggle";

const NavItem: React.FC<{ item: NavObj; onClick?: () => void }> = ({
    item,
    onClick,
}) => {
    const pathname = usePathname();
    const isActive = pathname === item.link; // 判断是否为当前路由

    return (
        <Link
            href={item.link}
            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            onClick={onClick}
        >
            {isActive && <SysIcon type={item.icon} className={styles.icon} />}
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

    // 判断是否是移动端
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleScrolly = () => {
            if (refRef.current) cancelAnimationFrame(refRef.current);
            refRef.current = requestAnimationFrame(() => {
                if (!isMobile) {
                    setScrollY(window.scrollY);
                }
            });
        };

        window.addEventListener("scroll", handleScrolly, { passive: true });
        setScrollY(window.scrollY);

        return () => {
            window.removeEventListener("scroll", handleScrolly);
            if (refRef.current) cancelAnimationFrame(refRef.current);
        };
    }, [isMobile]);

    return (
        <nav className={`${styles.NavWrapper} ${!isMobile && scrolly > 200 ? styles.scrolled : ""}`}>
            <div className={styles.mobileToggle}>
                <Checkbox open={open} onToggle={setOpen} />
            </div>

            {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

            <div
                ref={navMainRef}
                className={`${styles.NavMain} ${open ? styles.open : ""} ${!isMobile && scrolly > 200 ? styles.scrolled : ""}`}
            >
                {NavList.map((item) => (
                    <NavItem
                        key={item.key}
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
