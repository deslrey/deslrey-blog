import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styles from './index.module.scss'
import { BytemdViewer } from '../../components/Markdown/viewer';
import type { Article } from '../../../interfaces';
import request from '../../../utils/reques';
import { api } from '../../api';
import BanterComponent from '../../../loader/BanterComponent';

const ArticleDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [post, setPost] = useState<Article>();
    const [carouseUrl, _setCarouseUrl] = useState("");
    const [showLoading, setShowLoading] = useState(true); // ← 新增

    // 请求文章
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await request.get(`${api.article.articleDetail + id}`);

                if (res && res.code === 200) {
                    setPost(res.data);

                    // 让加载动画至少显示 5 秒
                    setTimeout(() => {
                        setShowLoading(false);
                    }, 5000);
                }
            } catch (error) {
                console.log(error);
            }
        };

        setShowLoading(true); // 每次切换文章重新进入加载态
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
            {showLoading ? (
                <BanterComponent />
            ) : (
                post && <BytemdViewer article={post} carouseUrl={carouseUrl} />
            )}
        </div>
    );
};

export default ArticleDetailPage;
