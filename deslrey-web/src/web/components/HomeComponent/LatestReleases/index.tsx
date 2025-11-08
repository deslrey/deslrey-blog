import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import styles from './index.module.scss'
import type { Article } from '../../../../interfaces/article';
import request from '../../../../utils/reques';
import { api } from '../../../api';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

const LatestReleases: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([])

    // ✅ 用 useEffect 来避免重复请求
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await request.get(api.article.LatestReleases)
                if (res && res.code === 200) {
                    setArticles(res.data)
                }
            } catch (error) {
                setArticles([])
            }
        }

        fetchArticles()
    }, [])

    return (
        <div className={`${styles.latestReleases} card-div`}>
            <h2 className={styles.sectionTitle}>最新更新</h2>
            {
                articles.length === 0 ? (
                    <div className={styles.empty}>暂无更多文章</div>
                ) : (
                    <div className={styles.timeline}>
                        {articles.map((article) => (
                            <div key={article.id} className={styles.timelineItem}>
                                <div className={styles.dot} />
                                <div className={styles.content}>
                                    <Link to={`/blog/${article.id}`}>
                                        <h3 className={styles.title}>{article.title}</h3>
                                    </Link>
                                </div>
                                <div className={styles.time}>
                                    {dayjs(article.createTime).fromNow()}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
            {articles.length >= 5 && (
                <div className={styles.more}>
                    <Link to="/article" className={styles.link}>
                        查看更多
                    </Link>
                </div>
            )}
        </div>
    );
}

export default LatestReleases
