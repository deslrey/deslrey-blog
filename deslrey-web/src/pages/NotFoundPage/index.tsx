import React from "react";
import { useNavigate } from "react-router";
import SEO from "../../components/SEO";
import styles from "./index.module.scss";

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.wrap}>
            <SEO title="404 - 页面未找到" description="你访问的页面不存在或已被移动。" />

            <div className={styles.card}>
                <div className={styles.inner}>
                    <div>
                        <h1 className={styles.title}>404</h1>
                        <p className={styles.subtitle}>
                            你访问的页面不存在，可能是链接输入错误，或者页面已被移动。
                            你可以回到首页继续浏览。
                        </p>

                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={`${styles.btn} ${styles.primary}`}
                                onClick={() => navigate("/", { replace: true })}
                            >
                                回到首页
                            </button>
                            <button
                                type="button"
                                className={`${styles.btn} ${styles.ghost}`}
                                onClick={() => navigate(-1)}
                            >
                                返回上一页
                            </button>
                        </div>

                        <div className={styles.hint}>
                            提示：如果你是从站内点击进入的，可以把路径发我，我帮你补路由或修链接。
                        </div>
                    </div>

                    <div className={styles.art} aria-hidden="true" />
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
