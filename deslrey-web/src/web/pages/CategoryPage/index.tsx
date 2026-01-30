import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import request from '../../../utils/request';
import { api } from '../../api';
import type { CountType } from '../../../interfaces';
import { useNavigate } from "react-router";
import BanterComponent from '../../../loader/BanterComponent';

const CategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<CountType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await request.get(api.category.categoryCount);
            if (res.code === 200) {
                setCategories(res.data);
            } else {
                setError(res.message || "获取分类失败");
            }
        } catch (error: any) {
            console.error("获取分类错误:", error);
            setError(error.message || "获取分类失败");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const displayedCount = categories.length;
    const totalPosts = categories.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className={styles.categoryPage}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>分类</h2>
                    <div className={styles.stats}>
                        <span className={styles.count}>{displayedCount} 个分类</span>
                        <span className={styles.total}>共 {totalPosts} 篇文章</span>
                    </div>
                </div>

                {error ? (
                    <div className={styles.errorContainer}>
                        <p className={styles.errorMessage}>{error}</p>
                        <button 
                            className={styles.retryButton}
                            onClick={fetchCategories}
                        >
                            重新加载
                        </button>
                    </div>
                ) : loading ? (
                    <div className={styles.loadingContainer}>
                        <BanterComponent />
                    </div>
                ) : displayedCount === 0 ? (
                    <div className={styles.emptyMessage}>
                        <p>暂无分类</p>
                    </div>
                ) : (
                    <div className={styles.list}>
                        {categories.map(item => (
                            <div
                                key={item.id}
                                className={styles.card}
                                onClick={() =>
                                    navigate(`/category/${encodeURIComponent(item.title)}`)
                                }
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        navigate(`/category/${encodeURIComponent(item.title)}`);
                                    }
                                }}
                            >
                                <div className={styles.content}>
                                    <span className={styles.catName}>{item.title}</span>
                                    <span className={styles.postCount}>{item.total} 篇文章</span>
                                </div>
                                <div className={styles.arrow}>
                                    <svg 
                                        width="20" 
                                        height="20" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    >
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
