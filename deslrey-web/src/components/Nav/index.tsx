"use client";

import React, { useState, useRef } from "react";
import styles from "./index.module.scss";
import SysIcon from "../SysIcon";
import { NavObj, NavList } from "./config";
import Link from "next/link";
import Checkbox from "../Checkbox";

const NavItem: React.FC<{ item: NavObj; onClick?: () => void }> = ({
    item,
    onClick,
}) => {
    return (
        <Link href={item.link} className={styles.navItem} onClick={onClick}>
            <SysIcon type={item.icon} className={styles.icon} />
            <span className={styles.title}>{item.title}</span>
        </Link>
    );
};

const Nav: React.FC = () => {
    const [open, setOpen] = useState(false);
    const navMainRef = useRef<HTMLDivElement>(null);

    return (
        <nav className={styles.NavWrapper}>
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
            </div>
        </nav>
    );
};

export default Nav;
