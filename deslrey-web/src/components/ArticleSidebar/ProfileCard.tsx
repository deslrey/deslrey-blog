import React, { useEffect, useState } from 'react';
import styles from './ProfileCard.module.scss';
import request from '../../utils/http';
import { api } from '../../api';
import { Github, Mail, Twitter } from 'lucide-react';

const ProfileCard: React.FC = () => {
    const [stats, setStats] = useState({
        posts: 0,
        tags: 0,
        categories: 0
    });

    const avatarUrl = "https://i-blog.csdnimg.cn/direct/0fb3d4a54f1544d7b82d786fb88a7b8e.jpeg";
    const name = "Deslrey";
    const signature = "牛马";

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [postsRes, tagsRes, catsRes] = await Promise.all([
                    request.get(api.article.articleList),
                    request.get(api.tag.tagCount),
                    request.get(api.category.categoryCount)
                ]);

                setStats({
                    posts: postsRes?.data?.length || 0,
                    tags: (tagsRes?.data || []).length,
                    categories: (catsRes?.data || []).length
                });
            } catch (error) {
                console.error("Failed to fetch profile stats", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className={styles.profileCard}>
            <div className={styles.avatarWrapper}>
                <img src={avatarUrl} alt="avatar" className={styles.avatar} />
            </div>
            <h2 className={styles.name}>{name}</h2>
            <p className={styles.signature}>{signature}</p>

            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <span className={styles.count}>{stats.posts}</span>
                    <span className={styles.label}>文章</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.count}>{stats.tags}</span>
                    <span className={styles.label}>标签</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.count}>{stats.categories}</span>
                    <span className={styles.label}>分类</span>
                </div>
            </div>

            <a href="https://github.com/deslrey" target="_blank" rel="noopener noreferrer" className={styles.followBtn}>
                关注我
            </a>

            <div className={styles.socialIcons}>
                <a href="https://github.com/deslrey" target="_blank" rel="noopener noreferrer">
                    <Github size={18} />
                </a>
                <a href="mailto:deslre0381@gmail.com">
                    <Mail size={18} />
                </a>
                <a href="https://twitter.com/derlse" target="_blank" rel="noopener noreferrer">
                    <Twitter size={18} />
                </a>
            </div>
        </div>
    );
};

export default ProfileCard;
