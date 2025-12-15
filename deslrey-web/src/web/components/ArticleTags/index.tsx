import React from "react";
import styles from "./index.module.scss";
import { Tag as TagIcon } from "lucide-react";
import { getTagIcon } from "../../../utils/tagIcons";

interface ArticleTagsProps {
    tags?: string[];
}

const ArticleTags: React.FC<ArticleTagsProps> = ({ tags }) => {
    if (!tags || tags.length === 0) return null;

    return (
        <div className={styles.tags}>
            {tags.map((tag) => {
                const icon = getTagIcon(tag);

                return (
                    <span key={tag} className={styles.tag}>
                        {/* simple-icons */}
                        {icon ? (
                            <span
                                className={styles.tagIcon}
                                style={{ color: icon.color }}
                                dangerouslySetInnerHTML={{ __html: icon.svg }}
                            />
                        ) : (
                            // lucide 兜底
                            <TagIcon className={styles.tagIcon} size={14} />
                        )}

                        <span className={styles.tagText}>{tag}</span>
                    </span>
                );
            })}
        </div>
    );
};

export default ArticleTags;
