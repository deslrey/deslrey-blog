import React from "react";
import styles from "./archive.module.scss";
import { ArticleList } from "@/json/Article";
import dayjs from "dayjs";

const Archive = () => {
    // 先按照年份分组
    const grouped = ArticleList.reduce<Record<string, typeof ArticleList>>(
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
                {years.map((year) => (
                    <div key={year} className={styles.yearBlock}>
                        <h2 className={styles.year}>{year}</h2>
                        <ul className={styles.articleList}>
                            {grouped[year]
                                .sort(
                                    (a, b) =>
                                        b.createTime.getTime() -
                                        a.createTime.getTime()
                                ) // 同一年内按时间倒序
                                .map((article) => (
                                    <li
                                        key={article.id}
                                        className={styles.articleItem}
                                    >
                                        <div className={styles.date}>
                                            {dayjs(article.createTime).format(
                                                "MM-DD"
                                            )}
                                        </div>
                                        <div className={styles.info}>
                                            <h3 className={styles.title}>
                                                {article.sticky && (
                                                    <span
                                                        className={
                                                            styles.sticky
                                                        }
                                                    >
                                                        📌
                                                    </span>
                                                )}
                                                {article.title}
                                                {article.edit && (
                                                    <span
                                                        className={styles.edit}
                                                    >
                                                        ✏️
                                                    </span>
                                                )}
                                            </h3>
                                            <p className={styles.des}>
                                                {article.des}
                                            </p>
                                            <div className={styles.meta}>
                                                {article.wordCount} 字 ·{" "}
                                                {article.readTime} 分钟
                                            </div>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Archive;
