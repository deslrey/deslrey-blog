import React, { useEffect, useState } from 'react'

import styles from './index.module.scss'
import type { CountType } from '../../../../interfaces'
import { Link } from 'react-router'
import request from '../../../../utils/request'
import { api } from '../../../api'

const Classify: React.FC = () => {

    const [classifys, setClassifys] = useState<CountType[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await request.get(api.category.categoryCount)
                if (res && res.code === 200) {
                    setClassifys(res.data)
                }
            } catch (error) {
                setClassifys([])
            }
        }

        fetchData()

    }, [])

    return (
        <div className={`${styles.classify} card-div`}>
            <h2 className={styles.sectionTitle}>分类</h2>
            <div className={styles.classifyGrid}>
                {classifys.length === 0 ? (
                    <div className={styles.empty}>暂无分类</div>
                ) :
                    (classifys.map((item, index) => (
                        <Link key={index} to={`/category/${item.title}`} className={styles.item}>
                            <div key={index} className={styles.classifyItem}>
                                <span className={styles.title}>{item.title}</span>
                                <span className={styles.total}>{item.total}</span>
                            </div></Link>
                    )))}
            </div>
        </div>
    );
}

export default Classify