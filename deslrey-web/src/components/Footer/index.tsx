import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { api } from '../../api';
import request from '../../utils/http';
import styles from './index.module.scss'

import { Github, Mail, Twitter, ChevronUp } from 'lucide-react';

const Footer: React.FC = () => {
    const [totalVisits, setTotalVisits] = useState<number>(0);
    const location = useLocation();

    const fetchStats = async () => {
        try {
            const res = await request.get(api.visit.stats);
            if (res && res.code === 200) {
                setTotalVisits(res.data.totalVisits || 0);
            }
        } catch (error) {
            console.error('获取访问量失败:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [location.pathname]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.topSection}>
                    <div className={styles.brandInfo}>
                        <h2 className={styles.logo}>Deslrey<span>Blog</span></h2>
                        <p className={styles.description}>记录技术学习与成长</p>
                        <div className={styles.socials}>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="GitHub">
                                <Github size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="mailto:example@email.com" className={styles.socialLink} title="Email">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    <div className={styles.linksSection}>
                        <div className={styles.linkGroup}>
                            <h3>快速导航</h3>
                            <ul>
                                <li><a href="/">首页</a></li>
                                {/* <li><a href="/archives">归档</a></li> */}
                                <li><a href="/category">分类</a></li>
                                <li><a href="/tag">标签</a></li>
                            </ul>
                        </div>
                        <div className={styles.linkGroup}>
                            <h3>关于</h3>
                            <ul>
                                <li><a href="/about">关于我</a></li>
                                <li><a href="/friends">友情链接</a></li>
                                <li><a href="/project">开源项目</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className={styles.statsSection}>
                        <div className={styles.visitCard}>
                            <span className={styles.label}>总访问量</span>
                            <span className={styles.count}>{totalVisits.toLocaleString()}</span>
                        </div>
                        <button className={styles.backToTop} onClick={scrollToTop} title="回到顶部">
                            <ChevronUp size={24} />
                        </button>
                    </div>
                </div>

                <div className={styles.bottomSection}>
                    <div className={styles.copyright}>
                        © {new Date().getFullYear()} Deslrey Blog. Crafted with <span>❤</span> and React.
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer
