import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import request from '../../../utils/reques';
import { api } from '../../api';
import type { CountType } from '../../../interfaces';

const CategoryPage: React.FC = () => {

    const [category, setCategory] = useState<CountType[]>([]);

    const fetchCatagorys = async () => {
        try {
            const res = await request.get(api.category.categoryCount);
            if (res.code === 200) {
                setCategory(res.data); // 直接设置分类数组
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCatagorys();
    }, []);

    return (
        <div className={styles.categoryPage}>
            <div className={styles.container}>
                <h2 className={styles.title}>分类</h2>

                <div className={styles.list}>
                    {category.map(item => (
                        <div key={item.id} className={`${styles.card} card-div`}>
                            <span className={styles.catName}>{item.title}</span>
                            <span className={styles.count}>共 {item.total} 篇博客</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
