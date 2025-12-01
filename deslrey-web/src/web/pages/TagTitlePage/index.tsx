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

const TagTitlePage: React.FC = () => {

    const { tag } = useParams<{ tag: string }>();
    const [title, setTitle] = useState<string>("");
    const [articles, setArticles] = useState<Article[]>([]);


    const fetchArticles = async (decodedTag: string) => {
        console.log(decodedTag)
        try {
            const res = await request.get(api.tag.tagArticle + `${decodedTag}`);
            if (res && res.code === 200) {
                setArticles(res.data);
            }

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (!tag) return;
        const decoded = decodeURIComponent(tag);
        setTitle(decoded);
        fetchArticles(decoded);
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
        <div className={styles.tagTitlePage}>
            <div className={styles.container}>
                <h3 className={styles.tagTitle}>{title}</h3>
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

export default TagTitlePage;
