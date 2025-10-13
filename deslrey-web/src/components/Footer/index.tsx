import React from "react";

import styles from "./index.module.scss";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const Footer: React.FC = () => {
    return (
        <div className={styles.footerPage}>
            <ThemeToggle />
        </div>
    );
};

export default Footer;
