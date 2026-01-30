import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");
import { Link } from "react-router";
import type { Article } from "../../../interfaces";
import BanterComponent from "../../../loader/BanterComponent";
import ArticleTags from "../ArticleTags";
import request from "../../../utils/request";

interface ArticleListProps {
    apiUrl: string;
    pageSize?: number;
    title?: string;
    showCategory?: boolean;
    showStats?: boolean;
    initialTotal?: number;
}

const ArticleList: React.FC<ArticleListProps> = ({
    apiUrl,
    pageSize = 10,
    title,
    showCategory = true,
    showStats = true,
    initialTotal = 0
}) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(initialTotal);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const fetchArticles = async (pageNum: number) => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await request.get(
                `${apiUrl}?page=${pageNum}&pageSize=${pageSize}`
            );
            
            if (res && res.code === 200) {
                setArticles(prev => {
                    const map = new Map<number, Article>();
                    [...prev, ...res.data.list].forEach(item => {
                        map.set(item.id, item);
                    });
                    return Array.from(map.values());
                });

                setTotal(res.data.total);
                setHasNextPage(res.data.hasNextPage);
            } else {
                setError(res?.message || "获取文章列表失败");
            }
        } catch (err: any) {
            console.error("获取文章列表错误:", err);
            setError(err.message || "获取文章列表失败");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(page);
    }, [page, pageSize, apiUrl]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loading && hasNextPage) {
                setPage((prevPage) => prevPage + 1);
            }
        }, {
            threshold: 0.1
        });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
        };
    }, [loading, hasNextPage]);

    const displayedCount = articles.length;

    return (
        <div className={styles.articleList}>
            {title && (
                <div className={styles.header}>
                    <h3 className={styles.listTitle}>{title}</h3>
                </div>
            )}

            {error ? (
                <div className={styles.errorContainer}>
                    <p className={styles.errorMessage}>{error}</p>
                    <button 
                        className={styles.retryButton}
                        onClick={() => fetchArticles(page)}
                    >
                        重新加载
                    </button>
                </div>
            ) : (
                <>
                    <ul className={styles.list}>
                        {articles.map((item) => (
                            <li key={item.id} className={styles.listItem}>
                                <Link
                                    to={`/detail/${item.id}`}
                                    className={styles.item}
                                >
                                    <div className={styles.content}>
                                        <h3 className={styles.articleTitle}>
                                            {item.title}
                                        </h3>

                                        <p className={styles.description}>{item.des}</p>

                                        <div className={styles.meta}>
                                            <div className={styles.infoGroup}>
                                                {showCategory && (
                                                    <span className={styles.category}>
                                                        #{item.category}
                                                    </span>
                                                )}
                                                
                                                <div className={styles.timeGroup}>
                                                    <span className={styles.date}>
                                                        {dayjs(item.createTime).fromNow()}
                                                    </span>
                                                    {item.edit && item.updateTime && (
                                                        <span className={styles.updated}>
                                                            • 更新于 {dayjs(item.updateTime).fromNow()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <ArticleTags tags={item.tags} />
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {loading && (
                        <div className={styles.loadingContainer}>
                            <BanterComponent />
                        </div>
                    )}

                    {!hasNextPage && !loading && displayedCount > 0 && showStats && (
                        <div className={styles.endMessage}>
                            已加载全部 {total} 篇文章
                        </div>
                    )}

                    {!hasNextPage && !loading && displayedCount === 0 && (
                        <div className={styles.empty}>
                            <p className={styles.emptyText}>暂无内容</p>
                        </div>
                    )}
                </>
            )}

            <div ref={loadMoreRef} className={styles.infiniteScrollTrigger}></div>
        </div>
    );
};

export default ArticleList;
