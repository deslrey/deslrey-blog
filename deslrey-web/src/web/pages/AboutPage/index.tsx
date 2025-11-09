import React from "react";
import styles from "./index.module.scss";

const AboutPage: React.FC = () => {
    return (
        <div className={styles.about}>
            <div className={`${styles.container} ${styles.cardDiv}`}>
                <img
                    src="/images/avatar.jpg"
                    alt="avatar"
                    className={styles.avatar}
                    width={120}
                    height={120}
                />
                <h2 className={styles.name}>deslrey</h2>
                <p className={styles.bio}>
                    👋 你好，我是一名前端开发者，我在学习 React、TypeScript 和现代 Web 技术。
                </p>
            </div>
        </div>
    );
};

export default AboutPage;
