import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

import { Link, useParams } from "react-router";
import type { Article } from "../../../interfaces";
import { api } from "../../api";
import request from "../../../utils/reques";
import BanterComponent from "../../../loader/BanterComponent";
import ArticleTags from "../../components/ArticleTags";

const CategoryTitlePage: React.FC = () => {
    const { category } = useParams<{ category: string }>();

    const [title, setTitle] = useState<string>("");
    const [articles, setArticles] = useState<Article[]>([]);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    /** 拉取数据（分页加载） */
    const fetchArticles = async (pageNum: number, catName: string) => {
        setLoading(true);
        try {
            const res = await request.get(
                `${api.category.categoryArticle}${catName}?page=${pageNum}&pageSize=${pageSize}`
            );

            if (res && res.code === 200) {
                setArticles((prev) => {
                    const map = new Map<number, Article>();
                    [...prev, ...res.data.list].forEach((item) => {
                        map.set(item.id, item);
                    });
                    return Array.from(map.values());
                });

                setHasNextPage(res.data.hasNextPage);
            }
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    /** 初次加载或分类变化 */
    useEffect(() => {
        if (!category) return;

        const decoded = decodeURIComponent(category);
        setTitle(decoded);

        // 重置分页状态
        setArticles([]);
        setPage(1);

        fetchArticles(1, decoded);
    }, [category]);

    /** 分页变化时继续加载 */
    useEffect(() => {
        if (!title) return;
        if (page === 1) return; // 第一次加载已处理
        fetchArticles(page, title);
    }, [page]);

    /** SEO 信息 */
    useEffect(() => {
        if (!title) return;

        document.title = `分类: ${title} - deslrey博客`;

        const description = document.querySelector('meta[name="description"]');
        const descContent = `分类「${title}」下共有 ${articles.length} 篇文章。`;
        if (description) {
            description.setAttribute("content", descContent);
        }

        const keywords = document.querySelector('meta[name="keywords"]');
        const keywordsContent = `${title}, 分类, 博客文章`;
        if (keywords) {
            keywords.setAttribute("content", keywordsContent);
        }
    }, [title, articles.length]);

    /** 触底加载 */
    useEffect(() => {
        const observer = new IntersectionObserver((e) => {
            if (e[0].isIntersecting && !loading && hasNextPage) {
                setPage((p) => p + 1);
            }
        });

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);

        return () => {
            if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
        };
    }, [loading, hasNextPage]);

    return (
        <div className={styles.categoryTitlePage}>
            <div className={styles.container}>
                <h3 className={styles.categoryTitle}>{title}</h3>

                {/* 列表 / 空状态 */}
                {!loading && articles.length === 0 ? (
                    <div className={styles.empty}>
                        <p>该分类暂无内容</p>
                    </div>
                ) : (
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

                                        <ArticleTags tags={item.tags} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </ul>
                )}


                {/* 加载动画 */}
                {loading && <BanterComponent />}

                {/* 触底触发器 */}
                <div ref={loadMoreRef} style={{ height: "40px" }} />
            </div>
        </div>
    );
};

export default CategoryTitlePage;
