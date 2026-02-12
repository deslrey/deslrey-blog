import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { api } from '../../api';
import request from '../../../utils/request';
import styles from './index.module.scss'

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

    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.visits}>
                    <span>总访问量: </span>
                    <span className={styles.count}>{totalVisits.toLocaleString()}</span>
                </div>
                <div className={styles.copyright}>
                    © 2025 Deslrey Blog. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer
