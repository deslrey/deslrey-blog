import React from "react";
import styles from "./classify.module.scss";
import { CategoryVO } from "@/interfaces/Article";
import { api } from "@/api";
import Link from "next/link";

const Classify = async () => {

    let classifyList: CategoryVO[] = []

    try {
        const res = await fetch(api.classify.categoryCountList, {
            cache: 'no-store'
        })

        if (!res.ok) {
            classifyList = []
        } else {
            const result = await res.json()
            classifyList = result.data || []
        }
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
                        <Link key={index} href={`/category/${item.title}`} className={styles.item}>
                            <div key={index} className={styles.classifyItem}>
                                <span className={styles.title}>{item.title}</span>
                                <span className={styles.total}>{item.total}</span>
                            </div></Link>
                    )))}
            </div>
        </div>
    );
};

export default Classify;
