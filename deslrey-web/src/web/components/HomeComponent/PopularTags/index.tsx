import React, { useEffect, useState } from 'react'

import styles from './index.module.scss'
import { Link } from 'react-router';
import type { CountType } from '../../../../interfaces';
import request from '../../../../utils/reques';
import { api } from '../../../api';

const PopularTags: React.FC = () => {

    const [tags, setTags] = useState<CountType[]>([])

    useEffect(() => {


        const fetchData = async () => {
            try {
                const res = await request.get(api.tag.tagCount)
                if (res && res.code === 200) {
                    setTags(res.data)
                }
            } catch (error) {
                setTags([])
            }
        }

        fetchData()

    }, [])


    return (
        <div className={`${styles.popularTags} card-div`}>
            <h2 className={styles.sectionTitle}>热门标签</h2>
            <div className={styles.tagGrid}>
                {
                    tags.length === 0 ? (
                        <div className={styles.empty}>暂无更多标签</div>
                    ) : (tags.map(tag => (
                        <Link key={tag.id} to={`/tag/${tag.title}`} className={styles.item}>
                            <div key={tag.id} className={styles.tagItem}>
                                <span className={styles.title}>{tag.title}</span>
                                <span className={styles.total}>{tag.total}</span>
                            </div>
                        </Link>
                    )))
                }
            </div>
        </div>
    );
}

export default PopularTags