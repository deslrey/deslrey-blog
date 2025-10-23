import React from "react";
import styles from "./latestReleases.module.scss";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import Link from "next/link";
import { LatestReleasesVO } from "@/interfaces/Article";
import { api } from "@/api";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

const LatestReleases = async () => {

    let articleList: LatestReleasesVO[] = []

    try {
        const res = await fetch(api.latestReleases.articleList, {
            cache: 'no-store'
        })

        if (!res.ok) {
            articleList = []
        }

        const result = await res.json()
        articleList = result.data || []

    } catch (error) {
        articleList = []
    }

    return (
        <div className={`${styles.latestReleases} card-div`}>
            <h2 className={styles.sectionTitle}>最新更新</h2>
            {
                articleList.length === 0 ? (
                    <div className={styles.empty}>暂无更多文章</div>
                ) : (<div className={styles.timeline}>
                    {articleList.map((article) => (
                        <div key={article.id} className={styles.timelineItem}>
                            <div className={styles.dot} />
                            <div className={styles.content}>
                                <Link href={`/blog/${article.id}`}>
                                    <h3 className={styles.title}>{article.title}</h3>
                                </Link>
                            </div>
                            <div className={styles.time}>
                                {dayjs(article.createTime).fromNow()}
                            </div>
                        </div>
                    ))}
                </div>)
            }
            {articleList.length > 5 && (
                <div className={styles.more}>
                    <Link href="/article" className={styles.link}>
                        查看更多
                    </Link>
                </div>
            )}
        </div>
    );
};

export default LatestReleases;
