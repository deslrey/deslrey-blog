import React from 'react';
import styles from './index.module.scss';
import { Article } from '@/interfaces/Article';
import { TriangleAlert } from 'lucide-react';

interface DetailHeadProps {
  data: Article;
  carouseUrl: string;
}

const DetailHead: React.FC<DetailHeadProps> = ({ data, carouseUrl }) => {

  const {
    title,
    des,
    category,
    createTime,
    updateTime,
    wordCount,
    readTime,
    views,
  } = data;

  // 格式化日期为中文形式
  const formatDateZh = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const w = weekdays[date.getDay()];
    return `${y}年${m}月${d}日 ${w}`;
  };

  // 判断是否修改过
  const isEdited = updateTime && createTime && new Date(updateTime) > new Date(createTime);

  return (
    <div
      className={styles.detailHeadPage}
      style={{
        backgroundImage: `url(${carouseUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className={styles.title}>{title}</h1>
      {des && <p className={styles.description}>{des}</p>}

      <div className={styles.meta}>
        <div className={styles.metaRow}>
          {createTime && <span>发布时间：{formatDateZh(createTime)}</span>}
          {updateTime && <span>更新：{formatDateZh(updateTime)}</span>}
        </div>
        <div className={styles.metaRow}>
          {category && <span>分类：{category}</span>}
        </div>
        <div className={styles.metaRow}>
          <span>字数：{wordCount}</span>
          <span>阅读时间：{readTime} 分钟</span>
          <span>阅读数：{views}</span>
        </div>
      </div>

      {isEdited && (
        <div className={styles.edit}>
          <p className={styles.editedNotice}>
            <TriangleAlert className={styles.alertIcon} />
            这篇文章上次修改于 {formatDateZh(updateTime!)}，可能部分内容已经不适用，如有疑问可询问作者
          </p>
        </div>
      )}
    </div>
  );
};

export default DetailHead;
