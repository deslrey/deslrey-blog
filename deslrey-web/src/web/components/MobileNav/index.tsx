"use client";

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import styles from "./index.module.scss";
import { useWebRoutes } from "../../../router/config";
import BgSeriesToggle from "../BgSeriesToggle";
import ThemeToggle from "../ThemeToggle.tsx";
import Checkbox from "../Checkbox/idnex.tsx";

const MobileNav: React.FC = () => {

    const location = useLocation();

    const [open, setOpen] = useState(false);

    // 禁止滚动背景
    useEffect(() => {
        const html = document.documentElement;

        if (open) {
            document.body.style.overflow = "hidden";
            html.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            html.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
            html.style.overflow = "";
        };
    }, [open]);


    return (
        <>
            {/* 悬浮按钮 */}
            <button className={styles.mobileNavButton} onClick={() => setOpen(!open)}>
                <Checkbox checked={open} onChange={() => setOpen(!open)} />
            </button>

            {/* 背景遮罩 */}
            {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

            {/* 移动端导航面板 */}
            <div className={`${styles.mobileNav} ${open ? styles.open : ""}`}>
                <div className={styles.mobileNavContent}>
                    {useWebRoutes().map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`${styles.navItem} ${location.pathname === item.path ? styles.activeNav : ""}`}
                            onClick={() => setOpen(false)}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span className={styles.navText}>{item.title}</span>
                        </Link>


                    ))}
                    <div
                        className={styles.themeToggleGroup}
                        style={{ animationDelay: `${0.1 * (useWebRoutes().length + 1)}s` }}
                    >
                        <ThemeToggle />
                        <BgSeriesToggle />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileNav;
