import React from "react";
import styles from "./article.module.scss";
import dayjs from "dayjs";
import Link from "next/link";
import { Article } from "@/interfaces/Article";
import { api } from "@/api";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ArticlePageProps {
    searchParams?: Promise<{
        page?: string;
    }>;
}

const ArticlePage = async ({ searchParams }: ArticlePageProps) => {
    const params = await searchParams;
    const page = Number(params?.page || 1);
    const pageSize = 4;
    let articleList: Article[] = [];
    let total = 0;
    let hasNextPage = false;
    let hasPreviousPage = false;

    try {
        const res = await fetch(
            `${api.article.articleList}?page=${page}&pageSize=${pageSize}`,
            { cache: "no-store" }
        );
        const result = await res.json();
        if (res.ok && result.code === 200) {
            articleList = result.data.list || [];
            total = result.data.total;
            hasNextPage = result.data.hasNextPage;
            hasPreviousPage = result.data.hasPreviousPage;
        }
    } catch {
        articleList = [];
    }

    const totalPages = Math.ceil(total / pageSize);

    const getPagination = (current: number, totalPages: number) => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            // 页数少，全部显示
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (current <= 4) {
                // 前半段
                pages.push(1, 2, 3, "...", totalPages);
            } else if (current >= totalPages - 3) {
                // 后半段
                pages.push(
                    1,
                    "...",
                    totalPages
                );
            } else {
                // 中间部分
                pages.push(
                    1,
                    "...",
                    current,
                    "...",
                    totalPages
                );
            }
        }

        return pages;
    };

    const pagination = getPagination(page, totalPages);

    return (
        <div className={styles.article}>
            <div className={styles.container}>
                <ul className={styles.list}>
                    {articleList.map((item) => (
                        <Link
                            key={item.id}
                            href={`/blog/${item.id}`}
                            className={styles.item}
                        >
                            <div>
                                <span className={styles.title}>
                                    {item.title}
                                    {item.sticky && <span className={styles.sticky}>置顶</span>}
                                </span>
                                <div className={styles.meta}>
                                    <span>{dayjs(item.createTime).format("YYYY-MM-DD HH:mm")}</span>
                                    {item.edit && <span className={styles.edit}>已编辑</span>}
                                    <span>{item.wordCount} 字</span>
                                    <span>预计阅读 {item.readTime ?? 1} 分钟</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </ul>

                {/*  分页导航 */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        {hasPreviousPage && (
                            <Link
                                href={`/article?page=${page - 1}`}
                                className={styles.pageBtn}
                            >
                                <ArrowLeft />
                            </Link>
                        )}

                        {pagination.map((p, idx) =>
                            p === "..." ? (
                                <span key={`dot-${idx}`} className={styles.ellipsis}>
                                    ...
                                </span>
                            ) : (
                                <Link
                                    key={p}
                                    href={`/article?page=${p}`}
                                    className={`${styles.pageBtn} ${p === page ? styles.activePage : ""
                                        }`}
                                >
                                    {p}
                                </Link>
                            )
                        )}

                        {hasNextPage && (
                            <Link
                                href={`/article?page=${page + 1}`}
                                className={styles.pageBtn}
                            >
                                <ArrowRight />
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticlePage;
