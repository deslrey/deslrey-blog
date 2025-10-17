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
    const [scrolly, setScrollY] = useState(0)

    const navMainRef = useRef<HTMLDivElement>(null);
    const refRef = useRef<number | null>(null)

    useEffect(() => {
        const handleScrolly = () => {
            if (refRef.current) {
                cancelAnimationFrame(refRef.current)
            }
            refRef.current = requestAnimationFrame(() => {
                setScrollY(window.scrollY)
                console.log("value ======>", window.scrollY);

            })
        }

        window.addEventListener("scroll", handleScrolly, { passive: true })

        setScrollY(window.scrollY)

        return () => {
            window.removeEventListener("scroll", handleScrolly)
            if (refRef.current) {
                cancelAnimationFrame(refRef.current)
            }
        }
    }, [])


    return (
        <nav className={`${styles.NavWrapper} ${scrolly > 200 ? styles.scrolled : ""}`}>
            {/* <BlogTitle /> */}
            <div className={styles.mobileToggle}>
                <Checkbox open={open} onToggle={setOpen} />
            </div>

            {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

            <div
                ref={navMainRef}
                className={`${styles.NavMain} ${open ? styles.open : ""} ${scrolly > 200 ? styles.scrolled : ""
                    }`}
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
