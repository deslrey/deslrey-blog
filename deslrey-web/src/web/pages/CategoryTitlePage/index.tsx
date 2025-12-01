import React, { useEffect, useState } from "react";
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

const CategoryTitlePage: React.FC = () => {

    const { category } = useParams<{ category: string }>();
    const [title, setTitle] = useState<string>("");
    const [articles, setArticles] = useState<Article[]>([]);


    const fetchArticles = async (decodedCategory: string) => {
        console.log(decodedCategory)
        try {
            const res = await request.get(api.category.categoryArticle + `${decodedCategory}`);
            if (res && res.code === 200) {
                setArticles(res.data);
            }

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (!category) return;
        const decoded = decodeURIComponent(category);
        setTitle(decoded);
        fetchArticles(decoded);
    }, [category]);


    useEffect(() => {
        if (!title) return;

        // 页面标题
        document.title = `分类: ${title} - deslrey博客`;

        // description
        const description = document.querySelector('meta[name="description"]');
        const descContent = `分类「${title}」下共有 ${articles.length} 篇文章。`;

        if (description) {
            description.setAttribute("content", descContent);
        } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = descContent;
            document.head.appendChild(meta);
        }

        // keywords
        const keywords = document.querySelector('meta[name="keywords"]');
        const keywordsContent = `${title}, 分类, 博客文章`;

        if (keywords) {
            keywords.setAttribute("content", keywordsContent);
        } else {
            const meta = document.createElement("meta");
            meta.name = "keywords";
            meta.content = keywordsContent;
            document.head.appendChild(meta);
        }

    }, [title, articles.length]);

    return (
        <div className={styles.categoryTitlePage}>
            <div className={styles.container}>
                <h3 className={styles.categoryTitle}>{title}</h3>
                <ul className={styles.list}>
                    {articles.map((item) => (
                        <Link
                            key={item.id}
                            to={`/detail/${item.id}`}
                            className={`${styles.item} card-div`}
                        >
                            <div>
                                <span className={styles.title}>
                                    {item.title}
                                    {item.sticky && <span className={styles.sticky}>置顶</span>}
                                </span>

                                <p className={styles.des}>{item.des}</p>

                                <div className={styles.meta}>
                                    <span>
                                        {dayjs(item.createTime).fromNow()}
                                    </span>
                                    {item.edit && <span className={styles.edit}>已编辑</span>}
                                    <span>#{item.category}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategoryTitlePage;
