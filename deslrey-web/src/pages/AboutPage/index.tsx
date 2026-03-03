import React from "react";
import styles from "./index.module.scss";
import {
    siReact,
    siVuedotjs,
    siJavascript,
    siHtml5,
    siCss,
    siOpenjdk,
    siGo,
    siDocker,
    siNginx,
} from "simple-icons";

const IconText = ({ icon, text }: { icon: any; text: string }) => (
    <div className={styles.iconText}>
        <span
            className={styles.icon}
            dangerouslySetInnerHTML={{ __html: icon.svg }}
            style={{
                fill: `#${icon.hex}`,
                width: "1.2em",
                height: "1.2em",
                verticalAlign: "middle",
                marginRight: "6px",
                display: "inline-block",
            }}
        />
        {text}
    </div>
);

const AboutPage: React.FC = () => {
    return (
        <div className={styles.about}>
            <div className={styles.container}>

                <div className={styles.content}>
                    <div className={styles.profile}>
                        <div className={styles.profileCard}>
                            <h2 className={styles.profileName}>Deslrey</h2>
                            <p className={styles.profileBio}>
                                👋 Hi~ 我是 Deslrey，一名前后端开发爱好者，热衷于现代 Web 技术。
                                <br />
                                <br />
                                专注于构建优雅、高效的应用程序，热爱开源文化与技术分享。
                            </p>
                        </div>
                    </div>

                    <div className={styles.skillsSection}>
                        <div className={styles.skillCategory}>
                            <h3 className={styles.categoryTitle}>前端技能</h3>
                            <div className={styles.skillGrid}>
                                <div className={styles.skillItem}>
                                    <IconText icon={siReact} text="React" />
                                </div>
                                <div className={styles.skillItem}>
                                    <IconText icon={siVuedotjs} text="Vue" />
                                </div>
                                <div className={styles.skillItem}>
                                    <IconText icon={siJavascript} text="JavaScript" />
                                </div>
                                <div className={styles.skillItem}>
                                    <IconText icon={siHtml5} text="HTML" />
                                </div>
                                <div className={styles.skillItem}>
                                    <IconText icon={siCss} text="CSS" />
                                </div>
                            </div>
                        </div>

                        <div className={styles.skillCategory}>
                            <h3 className={styles.categoryTitle}>后端技能</h3>
                            <div className={styles.skillGrid}>
                                <div className={styles.skillItem}>
                                    <IconText icon={siOpenjdk} text="Java" />
                                </div>
                                <div className={styles.skillItem}>
                                    <IconText icon={siGo} text="Go" />
                                </div>
                            </div>
                        </div>

                        <div className={styles.skillCategory}>
                            <h3 className={styles.categoryTitle}>工具与部署</h3>
                            <div className={styles.skillGrid}>
                                <div className={styles.skillItem}>
                                    <IconText icon={siDocker} text="Docker" />
                                </div>
                                <div className={styles.skillItem}>
                                    <IconText icon={siNginx} text="NGINX" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
