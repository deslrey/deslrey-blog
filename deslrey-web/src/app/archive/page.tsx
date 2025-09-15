import React from "react";
import styles from "./archive.module.scss";
import dayjs from "dayjs";
import { ArchiveVO } from "@/interfaces/Article";

const Archive = async () => {
    let articles: ArchiveVO[] = [];

    try {
        const res = await fetch("http://localhost:8080/deslrey/article/archiveList", {
            cache: "no-store",
        });

        if (!res.ok) {
            articles = [];
        }

        const result = await res.json();
        articles = result.data || [];
    } catch (error) {
        articles = [];
    }

    // 按年份分组
    const grouped = articles.reduce<Record<string, typeof articles>>(
        (acc, article) => {
            const year = dayjs(article.createTime).format("YYYY");
            if (!acc[year]) acc[year] = [];
            acc[year].push(article);
            return acc;
        },
        {}
    );

    // 按年份倒序
    const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

    return (
        <div className={styles.archive}>
            <div className={styles.container}>
                {articles.length === 0 ? (
                    <p className={styles.empty}>暂无数据</p>
                ) : (
                    years.map((year) => (
                        <div key={year} className={styles.yearBlock}>
                            <h2 className={styles.year}>{year} -- {grouped[year].length}篇</h2>
                            <ul className={styles.articleList}>
                                {grouped[year]
                                    .sort(
                                        (a, b) =>
                                            dayjs(b.createTime).valueOf() -
                                            dayjs(a.createTime).valueOf()
                                    )
                                    .map((article) => (
                                        <li
                                            key={article.id}
                                            className={styles.articleItem}
                                        >
                                            <div className={styles.date}>
                                                {dayjs(article.createTime).format(
                                                    "MM-DD HH:mm:ss"
                                                )}
                                            </div>
                                            <div className={styles.info}>
                                                <h3 className={styles.title}>
                                                    {article.title}
                                                    {article.edit && (
                                                        <span
                                                            className={styles.edit}
                                                        >
                                                            ✏️
                                                        </span>
                                                    )}
                                                </h3>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Archive;
