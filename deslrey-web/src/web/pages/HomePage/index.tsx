import React, { useState } from "react";
import styles from "./index.module.scss";
import { Github, Mail, Twitter } from "lucide-react";

const HomePage: React.FC = () => {
    // const onlineAvatar = "https://gcore.jsdelivr.net/gh/deslrey/deslrey-blog/deslrey-web/public/images/avatar.jpg";
    const onlineAvatar =
        "https://i-blog.csdnimg.cn/direct/0fb3d4a54f1544d7b82d786fb88a7b8e.jpeg";
    const localAvatar = "/images/avatar.jpg";

    const [avatarSrc, setAvatarSrc] = useState(onlineAvatar);

    return (
        <div className={styles.homePage}>
            <div className={styles.left}>
                <p className={`${styles.hello} ${styles.fadeUp} ${styles.delay1}`}>
                    Hi, I'm Deslrey 👋
                </p>

                <p className={`${styles.subTitle} ${styles.fadeUp} ${styles.delay2}`}>
                    A Full Stack{" "}
                    <span className={styles.Developer}>{`<Developer />`}</span>
                </p>

                <div className={`${styles.iconRow} ${styles.fadeUp} ${styles.delay3}`}>
                    <a
                        href="https://github.com/deslrey"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ backgroundColor: "#181717" }}
                    >
                        <Github size={22} />
                    </a>

                    <a
                        href="mailto:deslre0381@gmail.com"
                        style={{ backgroundColor: "#d44638" }}
                    >
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
