import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");
import { Link } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Article } from "../../../interfaces";
import { api } from "../../api";
import request from "../../../utils/reques";

const ArticlePage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await request.get(
                    `${api.article.articleList}?page=${page}&pageSize=${pageSize}`
                );
                if (res && res.code === 200) {
                    setArticles(res.data.list || []);
                    setTotal(res.data.total);
                    setHasNextPage(res.data.hasNextPage);
                    setHasPreviousPage(res.data.hasPreviousPage);
                }
            } catch (err) {
                setArticles([])
            }
        };

        fetchArticles();
    }, [page, pageSize]);

    const totalPages = Math.ceil(total / pageSize);

    const getPagination = (current: number, totalPages: number) => {
        const pages: (number | string)[] = [];

        if (totalPages <= 6) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (current <= 4) {
                pages.push(1, 2, 3, 4, "...", totalPages);
            } else if (current >= totalPages - 3) {
                pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", current - 1, current, current + 1, "...", totalPages);
            }
        }

        return pages;
    };

    const pagination = getPagination(page, totalPages);

    return (
        <div className={styles.article}>
            <div className={styles.container}>
                <ul className={styles.list}>
                    {articles.map((item) => (
                        <Link
                            key={item.id}
                            to={`/blog/${item.id}`}
                            className={`${styles.item} card-div`}
                        >
                            <div>
                                <span className={styles.title}>
                                    {item.title}
                                    {item.sticky && <span className={styles.sticky}>置顶</span>}
                                </span>
                                <div className={styles.meta}>
                                    <span>
                                        {dayjs(item.createTime).format("YYYY-MM-DD HH:mm dddd")}
                                    </span>
                                    {item.edit && <span className={styles.edit}>已编辑</span>}
                                    <span>#{item.category}</span>
                                    <span>浏览 {item.views}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </ul>

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.pageBtn}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ArrowLeft />
                        </button>

                        {pagination.map((p, idx) =>
                            p === "..." ? (
                                <span key={`dot-${idx}`} className={styles.ellipsis}>
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={p}
                                    className={`${styles.pageBtn} ${p === page ? styles.activePage : ""}`}
                                    onClick={() => setPage(Number(p))}
                                >
                                    {p}
                                </button>
                            )
                        )}

                        <button
                            className={styles.pageBtn}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            <ArrowRight />
                        </button>
                    </div>

                )}
            </div>
        </div>
    );
};

export default ArticlePage;
