import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useParams } from "react-router";
import { api } from "../../api";
import ArticleList from "../../components/ArticleList";

const TagTitlePage: React.FC = () => {
    const { tag } = useParams<{ tag: string }>();
    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        if (!tag) return;
        const decoded = decodeURIComponent(tag);
        setTitle(decoded);
    }, [tag]);

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
                {title && (
                    <ArticleList 
                        apiUrl={`${api.tag.tagArticle}${encodeURIComponent(title)}`}
                        title={title}
                        showCategory={true}
                        showStats={true}
                    />
                )}
            </div>
        </div>
    );
};

export default TagTitlePage;
