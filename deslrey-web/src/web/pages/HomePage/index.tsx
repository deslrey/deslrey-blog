import React, { useState } from "react";
import styles from "./index.module.scss";
import { Github, Mail, Twitter } from "lucide-react";

const HomePage: React.FC = () => {
    const onlineAvatar = "https://gcore.jsdelivr.net/gh/deslrey/deslrey-blog/deslrey-web/public/images/avatar.jpg";
    const localAvatar = "/images/avatar.jpg";

    const [_avatarSrc, setAvatarSrc] = useState(onlineAvatar);

    return (
        <div className={styles.homePage}>
            <div className={styles.left}>
                <p className={styles.hello}>Hi, I'm Deslrey 👋</p>

                <p className={styles.subTitle}>
                    A Full Stack <span className={styles.Developer}>{`<Developer />`}</span>
                </p>

                <div className={styles.iconRow}>
                    <a
                        href="https://github.com/deslrey"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ backgroundColor: "#181717" }}
                    >
                        <Github size={22} />
                    </a>

                    <a href="mailto:deslre0381@gmail.com" style={{ backgroundColor: "#d44638" }}>
                        <Mail size={22} />
                    </a>

                    <a
                        href="https://twitter.com/derlse"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ backgroundColor: "#242e36" }}
                    >
                        <Twitter size={22} />
                    </a>
                </div>
            </div>

            <img
                src={localAvatar}
                alt="avatar"
                className={styles.avatar}
                onError={() => setAvatarSrc(localAvatar)}
            />
        </div>
    );
};

export default HomePage;
