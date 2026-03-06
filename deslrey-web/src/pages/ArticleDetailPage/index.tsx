import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router';
import styles from './index.module.scss';
import type { Article } from '../../types';
import request from '../../utils/http';
import { api } from '../../api';
import BanterComponent from '../../loader/BanterComponent';
import SEO from '../../components/SEO';

// 异步加载 BytemdViewer
const LazyBytemdViewer = lazy(() => import('../../components/Markdown/viewer'));

const ArticleDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [post, setPost] = useState<Article | null>(null);
    const [carouseUrl, _setCarouseUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [readProgress, setReadProgress] = useState(0);

    // 请求文章数据
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await request.get(`${api.article.articleDetail}${id}`);
                if (res && res.code === 200) {
                    setPost(res.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const structuredData = post ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title || "文章详情",
        "description": post.des || post.title || "",
        "author": {
            "@type": "Person",
            "name": "Deslrey"
        },
        "datePublished": post.createTime,
        "dateModified": post.updateTime || post.createTime,
        "image": carouseUrl || "",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
        },
        "keywords": post.category || (post.tags ? post.tags.join(",") : post.title) || ""
    } : undefined;

    // 阅读进度条
    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
            setReadProgress(Math.min(100, Math.max(0, progress)));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={styles.blogBox}>
            {post && (
                <SEO
                    title={post.title}
                    description={post.des}
                    keywords={post.category || (post.tags ? post.tags.join(",") : "")}
                    image={carouseUrl}
                    type="article"
                    structuredData={structuredData}
                />
            )}
            {/* 阅读进度条 */}
            <div className={styles.readProgress} style={{ width: `${readProgress}%` }} />

            {/* 显示加载动画或文章 */}
            {loading ? (
                <BanterComponent />
            ) : post ? (
                <Suspense fallback={<BanterComponent />}>
                    <LazyBytemdViewer article={post} carouseUrl={carouseUrl} />
                </Suspense>
            ) : (
                <div className={styles.empty}>暂无数据</div>
            )}
        </div>
    );
};

export default ArticleDetailPage;
