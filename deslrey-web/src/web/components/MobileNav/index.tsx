"use client";

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import styles from "./index.module.scss";
import { useWebRoutes } from "../../../router/config";
import BgSeriesToggle from "../BgSeriesToggle";
import ThemeToggle from "../ThemeToggle.tsx";
import Checkbox from "../Checkbox/idnex.tsx";
import useNavStore from "../../store/navStore.ts";

const MobileNav: React.FC = () => {

    const location = useLocation();

    const [open, setOpen] = useState(false);

    const title = useNavStore((state) => state.title);

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
            {/* 悬浮操作栏 */}
            <div className={styles.floatingBar}>
                {/* 左侧 */}
                <div className={styles.leftArea}>
                    <button
                        className={styles.mobileNavButton}
                        onClick={() => setOpen(!open)}
                    >
                        <Checkbox checked={open} onChange={() => setOpen(!open)} />
                    </button>
                </div>

                {/* 中间文字 */}
                <div className={styles.centerText}>
                    {title || ""}
                </div>

                {/* 右侧预留 */}
                <div className={styles.rightArea}>
                    <button
                        className={styles.mobileNavButton}
                        onClick={() => setOpen(!open)}
                    >
                        <Checkbox checked={open} onChange={() => setOpen(!open)} />
                    </button>
                </div>
            </div>


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
