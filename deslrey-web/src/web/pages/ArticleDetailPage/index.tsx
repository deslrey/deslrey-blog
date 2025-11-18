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

    useEffect(() => {

        const fetchData = async () => {
            try {
                const res = await request.get(`${api.article.articleDetail + id}`)
                // console.log('res ======> ', res)

                if (res && res.code === 200) {
                    // console.log('data ======> ', res.data)
                    setPost(res.data)
                }
            } catch (error) {

            }
        }

        fetchData()

    }, [id])


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
