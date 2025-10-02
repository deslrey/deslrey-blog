import React from "react";
import Link from "next/link";
import styles from "./index.module.scss";
import { api } from "@/api";
import { Article } from "@/interfaces/Article";

const TagPage = async ({ params }: { params: Promise<{ title: string }> }) => {
    const { title } = await params;
    const decodedTitle = decodeURIComponent(title);

    let articleTags: Article[] = [];

    try {
        const res = await fetch(`${api.tagPage.articleTagsByTitle}/${decodedTitle}`, {
            cache: "no-store",
        });
        if (!res.ok) {
            articleTags = [];
        } else {
            const result = await res.json();
            articleTags = result.data || [];
        }
    } catch (error) {
        articleTags = [];
    }

    return (
        <div className={styles.tagPage}>
            <div className={styles.header}>
                <h1 className={styles.headerTitle}>#{decodedTitle}</h1>
                <p className={styles.headerDesc}>
                    共 {articleTags.length} 篇文章
                </p>
            </div>

            <div className={styles.content}>
                {articleTags.length > 0 ? (
                    <ul className={styles.articleList}>
                        {articleTags.map((article) => (
                            <li key={article.id} className={styles.articleItem}>
                                <Link href={`/blog/${article.id}`} className={styles.articleLink}>
                                    <span className={styles.dot}>•</span>
                                    <span className={styles.articleTitle}>{article.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.empty}>暂无相关文章</p>
                )}
            </div>
        </div>
    );
};

export default TagPage;
