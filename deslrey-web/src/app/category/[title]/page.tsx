import React from "react";
import styles from "./category.module.scss";
import { Article } from "@/interfaces/Article";
import { api } from "@/api";
import Link from "next/link";

const Category = async ({ params }: { params: Promise<{ title: string }> }) => {
    const { title } = await params;
    const decodedTitle = decodeURIComponent(title);

    let articles: Article[] = [];

    try {
        const res = await fetch(`${api.categoryPage.articleByTitle}/${decodedTitle}`, {
            cache: "no-store",
        });
        if (!res.ok) {
            articles = [];
        } else {
            const result = await res.json();
            articles = result.data || [];
        }
    } catch (error) {
        articles = [];
    }

    return (
        <div className={styles.category}>
            <div className={styles.header}>
                <h1 className={styles.headerTitle}>#{decodedTitle}</h1>
                <p className={styles.headerDesc}>
                    共 {articles.length} 篇文章
                </p>
            </div>

            <div className={styles.content}>
                {articles.length > 0 ? (
                    <ul className={styles.articleList}>
                        {articles.map((article) => (
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

export default Category;
