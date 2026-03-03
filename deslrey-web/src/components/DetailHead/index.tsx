import React from 'react';
import styles from './index.module.scss';
import { Calendar, Clock, FolderOpen, TriangleAlert } from 'lucide-react';
import type { Article } from '../../types';

interface DetailHeadProps {
    data: Article;
    carouseUrl: string;
}

const DetailHead: React.FC<DetailHeadProps> = ({ data }) => {
    const {
        title,
        des,
        category,
        createTime,
        updateTime,
        readTime,
        edit,
        tags
    } = data;

    const formatDateZh = (dateInput: string | Date) => {
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    };

    return (
        <div className={styles.detailHeadPage}>
            <div className={styles.detailHeader}>
                <h1 className={styles.title}>{title}</h1>
                {des && <p className={styles.description}>{des}</p>}

                <div className={styles.meta}>
                    {createTime && (
                        <span className={styles.metaItem}>
                            <Calendar size={16} />
                            {formatDateZh(createTime)}
                        </span>
                    )}
                    {readTime && (
                        <span className={styles.metaItem}>
                            <Clock size={16} />
                            {readTime} 分钟阅读
                        </span>
                    )}
                    {category && (
                        <span className={styles.metaItem}>
                            <FolderOpen size={16} />
                            {category}
                        </span>
                    )}
                </div>

                {tags && tags.length > 0 && (
                    <div className={styles.tags}>
                        {tags.map((tag: string, index: number) => (
                            <span key={index} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {edit && updateTime && (
                    <div className={styles.editNotice}>
                        <TriangleAlert size={16} />
                        <span>
                            这篇文章上次修改于 {formatDateZh(updateTime)}，可能部分内容已经不适用
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailHead;
