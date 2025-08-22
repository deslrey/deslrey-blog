import React from "react";
import styles from "./popularTags.module.scss";
import { TagList } from "@/json/Article";

const PopularTags = () => {
    return (
        <div className={styles.popularTags}>
            <h2 className={styles.sectionTitle}>热门标签</h2>
            <div className={styles.tagGrid}>
                {TagList.map((tag, index) => (
                    <div key={index} className={styles.tagItem}>
                        <span className={styles.title}>{tag.title}</span>
                        <span className={styles.total}>{tag.total}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularTags;
