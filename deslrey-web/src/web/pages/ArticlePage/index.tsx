import React from "react";
import styles from "./index.module.scss";
import { api } from "../../api";
import ArticleList from "../../components/ArticleList";

const ArticlePage: React.FC = () => {
    return (
        <div className={styles.article}>
            <div className={styles.container}>
                <ArticleList 
                    apiUrl={api.article.articleList}
                    title="文章"
                    showCategory={true}
                    showStats={true}
                />
            </div>
        </div>
    );
};

export default ArticlePage;
