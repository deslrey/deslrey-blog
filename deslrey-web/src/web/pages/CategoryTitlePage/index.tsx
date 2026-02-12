import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useParams, useLocation } from "react-router";
import { api } from "../../api";
import ArticleList from "../../components/ArticleList";
import request from "../../../utils/request";

const CategoryTitlePage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const location = useLocation();
    const [title, setTitle] = useState<string>("");
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!category) return;

        const decoded = decodeURIComponent(category);
        setTitle(decoded);

        const state = location.state as { id?: number } | null;
        if (state?.id) {
            setCategoryId(state.id);
            setLoading(false);
        } else {
            const fetchCategoryId = async () => {
                try {
                    const res = await request.get(api.category.categoryCount);
                    if (res.code === 200 && Array.isArray(res.data)) {
                        const found = res.data.find((item: any) => item.title === decoded);
                        if (found) {
                            setCategoryId(found.id);
                        }
                    }
                } catch (error) {
                    console.error("获取分类ID失败:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCategoryId();
        }
    }, [category, location.state]);

    useEffect(() => {
        if (!title) return;

        document.title = `分类: ${title} - deslrey博客`;

        const description = document.querySelector('meta[name="description"]');
        if (description) {
            description.setAttribute("content", `分类「${title}」下的文章列表。`);
        }

        const keywords = document.querySelector('meta[name="keywords"]');
        if (keywords) {
            keywords.setAttribute("content", `${title}, 分类, 博客文章`);
        }
    }, [title]);

    return (
        <div className={styles.categoryTitlePage}>
            <div className={styles.container}>
                {loading ? (
                    <div>加载中...</div>
                ) : title && categoryId ? (
                    <ArticleList
                        apiUrl={`${api.category.categoryArticle}${categoryId}`}
                        title={title}
                        showCategory={true}
                        showStats={true}
                    />
                ) : (
                    <div>未找到该分类</div>
                )}
            </div>
        </div>
    );
};

export default CategoryTitlePage;
