import React from "react";
import styles from "./latestReleases.module.scss";
import { ArticleList } from "@/json/Article";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import Link from "next/link";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

const LatestReleases = () => {
    return (
        <div className={styles.latestReleases}>
            <h2 className={styles.sectionTitle}>最新更新</h2>
            <div className={styles.timeline}>
                {ArticleList.map((article) => (
                    <div key={article.id} className={styles.timelineItem}>
                        <div className={styles.dot} />
                        <div className={styles.content}>
                            <h3 className={styles.title}>{article.title}</h3>
                        </div>
                        <div className={styles.time}>
                            {dayjs(article.createTime).fromNow()}
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.more}>
                <Link href="/article" className={styles.link}>
                    查看更多
                </Link>
            </div>
        </div>
    );
};

export default LatestReleases;
