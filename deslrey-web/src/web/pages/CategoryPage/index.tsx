import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import type { Article } from "../../../interfaces";
import { Link, useParams } from "react-router";
import { api } from "../../api";
import request from "../../../utils/reques";

const CategoryPage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const [articles, setArticles] = useState<Article[]>([]);
    const [title, setTitle] = useState<string>("");

    const fetchData = async (decodedCategory: string) => {
        if (!decodedCategory) return;

        try {
            const res = await request.get(api.category.categoryArticle + `${decodedCategory}`);
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
        if (!category) return;
        const decoded = decodeURIComponent(category);
        setTitle(decoded);
        fetchData(decoded);
    }, [category]);

    return (
        <div className={styles.category}>
            <div className={styles.header}>
                <h1 className={styles.headerTitle}>#{title}</h1>
                <p className={styles.headerDesc}>共 {articles.length} 篇文章</p>
            </div>

            <div className={styles.content}>
                {articles.length > 0 ? (
                    <ul className={styles.articleList}>
                        {articles.map((article) => (
                            <li key={article.id} className={`${styles.articleItem} card-div`}>
                                <Link to={`/blog/${article.id}`} className={styles.articleLink}>
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

export default CategoryPage;
