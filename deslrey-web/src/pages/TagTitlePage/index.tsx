import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useParams, useLocation } from "react-router";
import { api } from "../../api";
import ArticleList from "../../components/ArticleList";
import request from "../../utils/http";

const TagTitlePage: React.FC = () => {
    const { tag } = useParams<{ tag: string }>();
    const location = useLocation();
    const [title, setTitle] = useState<string>("");
    const [tagId, setTagId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!tag) return;
        const decoded = decodeURIComponent(tag);
        setTitle(decoded);

        const state = location.state as { id?: number } | null;
        if (state?.id) {
            setTagId(state.id);
            setLoading(false);
        } else {
            const fetchTagId = async () => {
                try {
                    const res = await request.get(api.tag.tagCount);
                    if (res.code === 200 && Array.isArray(res.data)) {
                        const found = res.data.find((item: any) => item.title === decoded);
                        if (found) {
                            setTagId(found.id);
                        }
                    }
                } catch (error) {
                    console.error("获取标签ID失败:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchTagId();
        }
    }, [tag, location.state]);

    useEffect(() => {
        if (!title) return;

        document.title = `标签: ${title} - deslrey博客`;

        const description = document.querySelector('meta[name="description"]');
        if (description) {
            description.setAttribute("content", `标签「${title}」下的文章列表。`);
        }

        const keywords = document.querySelector('meta[name="keywords"]');
        if (keywords) {
            keywords.setAttribute("content", `${title}, 标签, 博客文章`);
        }
    }, [title]);

    return (
        <div className={styles.tagTitlePage}>
            <div className={styles.container}>
                {loading ? (
                    <div>加载中...</div>
                ) : title && tagId ? (
                    <ArticleList
                        apiUrl={`${api.tag.tagArticle}${tagId}`}
                        title={title}
                        showCategory={true}
                        showStats={true}
                    />
                ) : (
                    <div>未找到该标签</div>
                )}
            </div>
        </div>
    );
};

export default TagTitlePage;
