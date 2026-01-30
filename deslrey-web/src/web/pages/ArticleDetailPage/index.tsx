import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router';
import styles from './index.module.scss';
import type { Article } from '../../../interfaces';
import request from '../../../utils/request';
import { api } from '../../api';
import BanterComponent from '../../../loader/BanterComponent';

// 异步加载 BytemdViewer
const LazyBytemdViewer = lazy(() => import('../../components/Markdown/viewer'));

const ArticleDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [post, setPost] = useState<Article | null>(null);
    const [carouseUrl, _setCarouseUrl] = useState("");
    const [loading, setLoading] = useState(true);

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

    // 修改 meta 信息
    useEffect(() => {
        if (!post) return;

        document.title = post.title || "文章详情";

        const description = document.querySelector('meta[name="description"]');
        if (description) {
            description.setAttribute("content", post.des || post.title || "");
        } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = post.des || post.title || "";
            document.head.appendChild(meta);
        }

        const keywords = document.querySelector('meta[name="keywords"]');
        if (keywords) {
            keywords.setAttribute("content", post.category || post.title || "");
        } else {
            const meta = document.createElement("meta");
            meta.name = "keywords";
            meta.content = post.category || post.title || "";
            document.head.appendChild(meta);
        }
    }, [post]);

    return (
        <div className={styles.blogBox}>
            {/* 显示加载动画或文章 */}
            <Suspense fallback={<BanterComponent />}>
                {loading ? (
                    <BanterComponent />
                ) : post ? (
                    <LazyBytemdViewer article={post} carouseUrl={carouseUrl} />
                ) : (
                    <div className={styles.empty}>暂无数据</div>
                )}
            </Suspense>
        </div>
    );
};

export default ArticleDetailPage;
