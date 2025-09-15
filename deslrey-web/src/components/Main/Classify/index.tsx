import React from "react";
import styles from "./classify.module.scss";
import { CategoryVO } from "@/interfaces/Article";

const Classify = async () => {

    let classifyList: CategoryVO[] = []

    try {
        const res = await fetch("http://localhost:8080/deslrey/category/list", {
            cache: 'no-store'
        })

        if (!res.ok) {
            classifyList = []
        }

        const result = await res.json()
        classifyList = result.data || []

    } catch (error) {
        classifyList = []
    }

    return (
        <div className={styles.classify}>
            <h2 className={styles.sectionTitle}>分类</h2>
            <div className={styles.classifyGrid}>
                {classifyList.length === 0 ? (
                    <div className={styles.empty}>暂无分类</div>
                ) :
                    (classifyList.map((item, index) => (
                        <div key={index} className={styles.classifyItem}>
                            <span className={styles.title}>{item.title}</span>
                            <span className={styles.total}>{item.total}</span>
                        </div>
                    )))}
            </div>
        </div>
    );
};

export default Classify;
