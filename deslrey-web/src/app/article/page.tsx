'use client'

import React, { useState } from "react";
import styles from "./article.module.scss";
import { ArticleList } from "@/json/Article";
import dayjs from "dayjs";
import Link from "next/link";

const Article = () => {
    // 保存每个文章的偏移
    const [offsets, setOffsets] = useState<{ [key: number]: { x: number, y: number } }>({});

    const handleMouseMove = (e: React.MouseEvent, id: number) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10; // x 偏移量
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;  // y 偏移量
        setOffsets((prev) => ({ ...prev, [id]: { x, y } }));
    };

    const handleMouseLeave = (id: number) => {
        setOffsets((prev) => ({ ...prev, [id]: { x: 0, y: 0 } }));
    };

    return (
        <div className={styles.article}>
            <div className={styles.container}>
                <ul className={styles.list}>
                    {ArticleList.map((item) => {
                        const offset = offsets[item.id] || { x: 0, y: 0 };
                        return (
                            <Link
                                key={item.id}
                                href={`/blog/${item.id}`}
                                className={styles.item}
                                onMouseMove={(e) => handleMouseMove(e, item.id)}
                                onMouseLeave={() => handleMouseLeave(item.id)}
                                style={{
                                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                                    transition: "transform 0.1s",
                                }}
                            >
                                <div>
                                    <span className={styles.title}>
                                        {item.title}
                                        {item.sticky && (
                                            <span className={styles.sticky}>置顶</span>
                                        )}
                                    </span>
                                    <div className={styles.meta}>
                                        <span>
                                            {dayjs(item.createTime).format(
                                                "YYYY-MM-DD HH:mm"
                                            )}
                                        </span>
                                        {item.edit && (
                                            <span className={styles.edit}>已编辑</span>
                                        )}
                                        <span>{item.wordCount} 字</span>
                                        <span>预计阅读 {item.readTime} 分钟</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Article;
