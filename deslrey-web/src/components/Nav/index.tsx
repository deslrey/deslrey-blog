import React from "react";
import styles from "./index.module.scss";
import SysIcon from "../SysIcon";
import { NavObj, NavList } from "./config";
import Link from "next/link";

const NavItem: React.FC<{ item: NavObj }> = ({ item }) => {
    return (
        <Link href={item.link} className={styles.navItem}>
            <SysIcon type={item.icon} className={styles.icon} />
            <span className={styles.title}>{item.title}</span>
        </Link>
    );
};

const Nav: React.FC = () => {
    return (
        <nav className={styles.NavMain}>
            {NavList.map((item) => (
                <NavItem key={item.key} item={item} />
            ))}
        </nav>
    );
};

export default Nav;
