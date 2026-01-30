import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useParams } from "react-router";
import { api } from "../../api";
import ArticleList from "../../components/ArticleList";

const CategoryTitlePage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        if (!category) return;

        const decoded = decodeURIComponent(category);
        setTitle(decoded);
    }, [category]);

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
                {title && (
                    <ArticleList 
                        apiUrl={`${api.category.categoryArticle}${encodeURIComponent(title)}`}
                        title={title}
                        showCategory={true}
                        showStats={true}
                    />
                )}
            </div>
        </div>
    );
};

export default CategoryTitlePage;
