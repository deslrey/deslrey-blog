import React from "react";
import styles from "./popularTags.module.scss";
import { TagList } from "@/json/Article";
import { TagVO } from "@/interfaces/Article";

const PopularTags = async () => {

    let tagList: TagVO[] = []

    try {

        const res = await fetch("http://localhost:8080/deslrey/tag/list/", {
            cache: 'no-store'
        })

        if (!res.ok) {
            tagList = []
        }

        const result = await res.json()
        tagList = result.data || []
    } catch (error) {
        tagList = []
    }

    return (
        <div className={styles.popularTags}>
            <h2 className={styles.sectionTitle}>热门标签</h2>
            <div className={styles.tagGrid}>
                {
                    tagList.length === 0 ? (
                        <div className={styles.empty}>暂无更多标签</div>
                    ) : (tagList.map(tag => (
                        <div key={tag.id} className={styles.tagItem}>
                            <span className={styles.title}>{tag.title}</span>
                            <span className={styles.total}>{tag.total}</span>
                        </div>
                    )))
                }
            </div>
        </div>
    );
};

export default PopularTags;
