import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");
import { Link } from "react-router";
import type { Article } from "../../../interfaces";
import { api } from "../../api";
import request from "../../../utils/reques";
import BanterComponent from "../../../loader/BanterComponent";

const ArticlePage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [_total, setTotal] = useState(0);
    const [_hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // 加载文章（追加模式）
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const res = await request.get(
                    `${api.article.articleList}?page=${page}&pageSize=${pageSize}`
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
                }

            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };

        fetchArticles();
    }, [page, pageSize]);

    // 观察触底加载
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loading && _hasNextPage) {
                setPage((p) => p + 1);
            }
        });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
        };
    }, [loading, _hasNextPage]);


    return (
        <div className={styles.article}>
            <div className={styles.container}>
                <h2 className={styles.title}>文章</h2>
                <ul className={styles.list}>
                    {articles.map((item) => (
                        <Link
                            key={item.id}
                            to={`/detail/${item.id}`}
                            className={`${styles.item} card-div`}
                        >
                            <div>
                                <span className={styles.articleTitle}>
                                    {item.title}
                                </span>

                                <p className={styles.des}>{item.des}</p>
                                <div className={styles.meta}>
                                    <span>#{item.category}</span>

                                    <div className={styles.timeGroup}>
                                        <span>{dayjs(item.createTime).fromNow()}</span>
                                        {item.edit && item.updateTime && (
                                            <span className={styles.updated}>
                                                （更新于 {dayjs(item.updateTime).fromNow()}）
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </ul>

                {/* 加载动画 */}
                {loading && (
                    <BanterComponent />
                )}

                {/* 触底触发器 */}
                <div ref={loadMoreRef} style={{ height: "40px" }}></div>
            </div>
        </div>
    );
};

export default ArticlePage;
