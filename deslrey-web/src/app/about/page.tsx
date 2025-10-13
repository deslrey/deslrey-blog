import React from "react";
import styles from "./about.module.scss";
import Image from "next/image";
import avatar from "@/images/avatar.jpg";

const About = () => {
    return (
        <div className={styles.about}>
            <div className={styles.container}>
                <Image
                    src={avatar}
                    alt="avatar"
                    className={styles.avatar}
                    width={120}
                    height={120}
                    priority
                />
                <h2 className={styles.name}>deslrey</h2>
                <p className={styles.bio}>
                    👋 你好，我是一名前端开发者，我在学习 React、TypeScript 和现代
                    Web 技术。
                    {/* 👋 你好，我是一名前端开发者，热爱 React、TypeScript 和现代
                    Web 技术。 */}
                </p>
            </div>
        </div>
    );
};

export default About;
