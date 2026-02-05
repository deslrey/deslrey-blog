import React, { useEffect, useState } from "react";
import { Tag as DefaultTagIcon } from "lucide-react";
import styles from "./index.module.scss";
import request from "../../../utils/request";
import { api } from "../../api";
import type { CountType } from "../../../interfaces";
import { getTagIcon } from "../../../utils/tagIcons";
import { useNavigate } from "react-router";
import BanterComponent from "../../../loader/BanterComponent";

const TagPage: React.FC = () => {
    const [tags, setTags] = useState<CountType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchTags = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await request.get(api.tag.tagCount);
            if (res.code === 200) {
                setTags(res.data);
            } else {
                setError(res.message || "获取标签失败");
            }
        } catch (error: any) {
            console.error("获取标签错误:", error);
            setError(error.message || "获取标签失败");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const displayedCount = tags.length;

    return (
        <div className={styles.tagPage}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>标签</h2>
                </div>

                {error ? (
                    <div className={styles.errorContainer}>
                        <p className={styles.errorMessage}>{error}</p>
                        <button 
                            className={styles.retryButton}
                            onClick={fetchTags}
                        >
                            重新加载
                        </button>
                    </div>
                ) : loading ? (
                    <div className={styles.loadingContainer}>
                        <BanterComponent />
                    </div>
                ) : displayedCount === 0 ? (
                    <div className={styles.emptyMessage}>
                        <p>暂无标签</p>
                    </div>
                ) : (
                    <div className={styles.list}>
                        {tags.map((item) => {
                            const icon = getTagIcon(item.title);

                            return (
                                <div
                                    key={item.id}
                                    className={styles.card}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => navigate(`/tag/${encodeURIComponent(item.title)}`)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            navigate(`/tag/${encodeURIComponent(item.title)}`);
                                        }
                                    }}
                                >
                                    <div className={styles.content}>
                                        {icon ? (
                                            <span
                                                className={styles.icon}
                                                style={{ color: icon.color }}
                                                dangerouslySetInnerHTML={{
                                                    __html: icon.svg
                                                }}
                                            />
                                        ) : (
                                            <DefaultTagIcon className={styles.icon} />
                                        )}

                                        <span className={styles.tagName}>
                                            {item.title}
                                        </span>
                                    </div>

                                    <span className={styles.postCount}>
                                        {item.total} 篇
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TagPage;
