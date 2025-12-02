// AboutPage.tsx
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
            <div className={`${styles.container} ${styles.cardDiv} card-div`}>
                <h2 className={styles.name}>Deslrey</h2>
                <p className={styles.bio}>
                    👋 Hi~ 我是 Deslrey，一名前后端开发爱好者，热衷于现代 Web 技术。
                </p>

                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>前端</h3>
                    <div className={styles.skills}>
                        <IconText icon={siReact} text="React" />
                        <IconText icon={siVuedotjs} text="Vue" />
                        <IconText icon={siJavascript} text="JavaScript" />
                        <IconText icon={siHtml5} text="HTML" />
                        <IconText icon={siCss} text="CSS" />
                    </div>
                </section>

                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>后端</h3>
                    <div className={styles.skills}>
                        <IconText icon={siOpenjdk} text="Java" />
                        <IconText icon={siGo} text="Go" />
                    </div>
                </section>

                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>工具</h3>
                    <div className={styles.skills}>
                        <IconText icon={siDocker} text="Docker" />
                        <IconText icon={siNginx} text="NGINX" />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
