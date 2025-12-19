import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Github, Mail, Twitter } from "lucide-react";

const TEXTS = [
    {
        text: "A Full Stack <Developer />",
        highlight: "<Developer />",
    },
    {
        text: "一名全栈开发工程师",
        highlight: "",
    },
];

const TYPING_SPEED = 120;
const DELETING_SPEED = 80;
const HOLD_TIME = 1500;

const HomePage: React.FC = () => {
    const onlineAvatar =
        "https://i-blog.csdnimg.cn/direct/0fb3d4a54f1544d7b82d786fb88a7b8e.jpeg";
    const localAvatar = "/images/avatar.jpg";

    const [avatarSrc, setAvatarSrc] = useState(onlineAvatar);

    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    const current = TEXTS[textIndex];
    const currentText = current.text.slice(0, charIndex);

    useEffect(() => {
        let timer: number;

        if (!isDeleting && charIndex < current.text.length) {
            timer = window.setTimeout(
                () => setCharIndex((i) => i + 1),
                TYPING_SPEED
            );
        } else if (!isDeleting && charIndex === current.text.length) {
            timer = window.setTimeout(() => setIsDeleting(true), HOLD_TIME);
        } else if (isDeleting && charIndex > 0) {
            timer = window.setTimeout(
                () => setCharIndex((i) => i - 1),
                DELETING_SPEED
            );
        } else if (isDeleting && charIndex === 0) {
            setIsDeleting(false);
            setTextIndex((i) => (i + 1) % TEXTS.length);
        }

        return () => clearTimeout(timer);
    }, [charIndex, isDeleting, textIndex]);

    const renderText = () => {
        if (!current.highlight || !currentText.includes(current.highlight)) {
            return currentText;
        }

        const [before] = currentText.split(current.highlight);

        return (
            <>
                {before}
                <span className={styles.Developer}>
                    {current.highlight}
                </span>
            </>
        );
    };

    return (
        <div className={styles.homePage}>
            <div className={styles.left}>
                <p className={`${styles.hello} ${styles.fadeUp} ${styles.delay1}`}>
                    Hi, I'm Deslrey 👋
                </p>

                <p className={`${styles.subTitle} ${styles.fadeUp} ${styles.delay2}`}>
                    {renderText()}
                    <span className={styles.cursor} />
                </p>

                <div className={`${styles.iconRow} ${styles.fadeUp} ${styles.delay3}`}>
                    <a href="https://github.com/deslrey" target="_blank" rel="noopener noreferrer">
                        <Github size={22} />
                    </a>
                    <a href="mailto:deslre0381@gmail.com">
                        <Mail size={22} />
                    </a>
                    <a href="https://twitter.com/derlse" target="_blank" rel="noopener noreferrer">
                        <Twitter size={22} />
                    </a>
                </div>
            </div>

            <img
                src={avatarSrc}
                alt="avatar"
                className={`${styles.avatar} ${styles.fadeUp} ${styles.delay2}`}
                referrerPolicy="no-referrer"
                onError={() => setAvatarSrc(localAvatar)}
            />
        </div>
    );
};

export default HomePage;
