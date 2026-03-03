import React from 'react';
import styles from './NoticeCard.module.scss';
import { Megaphone } from 'lucide-react';

const NoticeCard: React.FC = () => {
    return (
        <div className={styles.noticeCard}>
            <div className={styles.title}>
                <Megaphone size={18} />
                <span>公告</span>
            </div>
            <div className={styles.content}>
                <p>欢迎来到 Deslrey 的个人空间！</p>
                <p>这里记录了我的技术学习。</p>
                <p>持续进步。</p>
            </div>
        </div>
    );
};

export default NoticeCard;
