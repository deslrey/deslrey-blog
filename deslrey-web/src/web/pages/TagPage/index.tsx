import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Link, useParams } from "react-router";
import type { Article } from "../../../interfaces";
import request from "../../../utils/reques";
import { api } from "../../api";

const TagPage: React.FC = () => {

    const { tag } = useParams<{ tag: string }>();
    const [articles, setArticles] = useState<Article[]>([]);
    const [title, setTitle] = useState<string>("");

    const fetchData = async (decodeTag: string) => {
        if (!decodeTag) return;
        try {
            const res = await request.get(api.tag.tagArticle + `${decodeTag}`);
            if (res && res.code === 200) {
                setArticles(res.data);
            } else {
                setArticles([]);
            }
        } catch (error) {
            setArticles([]);
        }
    };

    useEffect(() => {
        if (!tag) return;

        const decode = decodeURIComponent(tag);
        setTitle(decode);
        fetchData(decode);
    }, [tag]);

    useEffect(() => {
        if (!title) return;

        // 修改页面标题
        document.title = `标签: ${title} - deslrey博客`;

        // 修改 meta description
        const description = document.querySelector('meta[name="description"]');
        if (description) {
            description.setAttribute(
                "content",
                `包含标签「${title}」的所有文章，共 ${articles.length} 篇。`
            );
        } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = `包含标签「${title}」的所有文章，共 ${articles.length} 篇。`;
            document.head.appendChild(meta);
        }

        // 修改 meta keywords
        const keywords = document.querySelector('meta[name="keywords"]');
        if (keywords) {
            keywords.setAttribute("content", `${title}, 标签, 博客文章`);
        } else {
            const meta = document.createElement("meta");
            meta.name = "keywords";
            meta.content = `${title}, 标签, 博客文章`;
            document.head.appendChild(meta);
        }

    }, [title, articles.length]);

    return (
        <div className={styles.tagPage}>
            <div className={styles.header}>
                <h1 className={styles.headerTitle}>#{title}</h1>
                <p className={styles.headerDesc}>
                    共 {articles.length} 篇文章
                </p>
            </div>

            <div className={styles.content}>
                {articles.length > 0 ? (
                    <ul className={styles.articleList}>
                        {articles.map((article) => (
                            <li key={article.id} className={`${styles.articleItem} card-div`}>
                                <Link to={`/detail/${article.id}`} className={styles.articleLink}>
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
