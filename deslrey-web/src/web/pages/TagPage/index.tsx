import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Link, useParams } from "react-router";
import type { Article } from "../../../interfaces";
import request from "../../../utils/reques";
import { api } from "../../api";

const TagPage: React.FC = () => {

    const { tag } = useParams<{ tag: string }>()
    const [articles, setArticles] = useState<Article[]>([])
    const [title, setTitle] = useState<string>('')

    const fetchData = async (decodeTag: string) => {
        if (!decodeTag) {
            return
        }
        try {
            const res = await request.get(api.tag.tagArticle + `${decodeTag}`)
            if (res && res.code === 200) {
                setArticles(res.data)
            } else {
                setArticles([])
            }
        } catch (error) {
            setArticles([])
        }
    }

    useEffect(() => {
        if (!tag) {
            return
        }
        const decode = decodeURIComponent(tag)
        setTitle(tag)
        fetchData(decode)
    }, [tag])

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
