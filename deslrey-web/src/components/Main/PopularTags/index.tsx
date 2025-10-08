import React from "react";
import styles from "./popularTags.module.scss";
import { TagVO } from "@/interfaces/Article";
import { api } from "@/api";
import Link from "next/link";

const PopularTags = async () => {

    let tagList: TagVO[] = []

    try {

        const res = await fetch(api.popularTags.tagCountList, {
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
                        <Link key={tag.id} href={`/tag/${tag.title}`} className={styles.item}>
                            <div key={tag.id} className={styles.tagItem}>
                                <span className={styles.title}>{tag.title}</span>
                                <span className={styles.total}>{tag.total}</span>
                            </div>
                        </Link>
                    )))
                }
            </div>
        </div>
    );
};

export default PopularTags;
