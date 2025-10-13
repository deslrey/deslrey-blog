"use client";

import React, { useState, useRef } from "react";
import styles from "./index.module.scss";
import SysIcon from "../SysIcon";
import { NavObj, NavList } from "./config";
import Link from "next/link";
import Checkbox from "../Checkbox";
import { usePathname } from "next/navigation";
import BlogTitle from "../BlogTitle";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

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
    const navMainRef = useRef<HTMLDivElement>(null);

    return (
        <nav className={styles.NavWrapper}>

            {/* <BlogTitle /> */}

            {/* 移动端汉堡按钮 */}
            <div className={styles.mobileToggle}>
                <Checkbox open={open} onToggle={setOpen} />
            </div>

            {/* 菜单内容 */}
            {open && (
                <div
                    className={styles.overlay}
                    onClick={() => setOpen(false)}
                />
            )}
            <div
                ref={navMainRef}
                className={`${styles.NavMain} ${open ? styles.open : ""}`}
            >
                {NavList.map((item) => (
                    <NavItem
                        key={item.key}
                        item={item}
                        onClick={() => setOpen(false)}
                    />
                ))}
                <ThemeToggle />
            </div>
        </nav>

    );
};

export default Nav;
