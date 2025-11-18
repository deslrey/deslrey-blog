import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styles from './index.module.scss'
import { BytemdViewer } from '../../components/Markdown/viewer';
import type { Article } from '../../../interfaces';
import request from '../../../utils/reques';
import { api } from '../../api';

const ArticleDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [post, setPost] = useState<Article>();
    const [carouseUrl, setCarouseUrl] = useState("");

    // 文章数据请求
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await request.get(`${api.article.articleDetail + id}`);

                if (res && res.code === 200) {
                    setPost(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (!post) return;

        document.title = post.title || "文章详情";

        // 修改 meta description
        const description = document.querySelector('meta[name="description"]');
        if (description) {
            description.setAttribute("content", post.des || post.title || "");
        } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = post.des || post.title || "";
            document.head.appendChild(meta);
        }

        // 修改 keywords
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
            {post ? (
                <BytemdViewer article={post} carouseUrl={carouseUrl} />
            ) : (
                <div>加载中...</div>
            )}
        </div>
    );
}

export default ArticleDetailPage;
