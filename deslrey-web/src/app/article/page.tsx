import React from "react";
import styles from "./article.module.scss";
import { ArticleList } from "@/json/Article";
import dayjs from "dayjs";
import Link from "next/link";

const Article = () => {
    return (
        <div className={styles.article}>
            <div className={styles.container}>
                <ul className={styles.list}>
                    {ArticleList.map((item) => (
                        <Link
                            key={item.id}
                            href={`/article/${item.id}`}
                            className={styles.item}
                        >
                            <div>
                                <span className={styles.title}>
                                    {item.title}
                                    {item.sticky && (
                                        <span className={styles.sticky}>
                                            置顶
                                        </span>
                                    )}
                                </span>
                                <p className={styles.des}>{item.des}</p>
                                <div className={styles.meta}>
                                    <span>
                                        {dayjs(item.createTime).format(
                                            "YYYY-MM-DD HH:mm"
                                        )}
                                    </span>
                                    {item.edit && (
                                        <span className={styles.edit}>
                                            已修改
                                        </span>
                                    )}
                                    <span>{item.wordCount} 字</span>
                                    <span>预计阅读 {item.readTime} 分钟</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Article;
