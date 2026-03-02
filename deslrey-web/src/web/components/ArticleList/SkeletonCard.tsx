import React from "react";
import styles from "./index.module.scss";

const SkeletonCard: React.FC = () => {
    return (
        <div className={`${styles.item} ${styles.skeleton}`}>
            <div className={styles.content}>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonDescription}></div>
                <div className={styles.skeletonDescription}></div>
                
                <div className={styles.meta}>
                    <div className={styles.infoGroup}>
                        <div className={styles.skeletonCategory}></div>
                        <div className={styles.skeletonDate}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
