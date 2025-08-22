import React from "react";
import styles from "./classify.module.scss";
import { ClassifyList } from "@/json/Article";

const Classify = () => {
    return (
        <div className={styles.classify}>
            <h2 className={styles.sectionTitle}>分类</h2>
            <div className={styles.classifyGrid}>
                {ClassifyList.map((item, index) => (
                    <div key={index} className={styles.classifyItem}>
                        <span className={styles.title}>{item.title}</span>
                        <span className={styles.total}>{item.total}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Classify;
