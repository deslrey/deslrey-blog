import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import request from "../../../utils/reques";
import { api } from "../../api";
import type { CountType } from "../../../interfaces";
import { getTagIcon } from "../../../utils/tagIcons";
import { useNavigate } from "react-router";

const TagPage: React.FC = () => {
    const [tags, setTags] = useState<CountType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        request.get(api.tag.tagCount).then((res) => {
            if (res.code === 200) setTags(res.data);
        });
    }, []);

    return (
        <div className={styles.tagPage}>
            <div className={styles.container}>
                <h2 className={styles.title}>标签</h2>

                <div className={styles.list}>
                    {tags.map((item) => {
                        const icon = getTagIcon(item.title);
                        return (
                            <div
                                key={item.id}
                                className={styles.card}
                                onClick={() => navigate(`/tag/${item.title}`)}
                            >
                                <div className={styles.left}>
                                    {icon && (
                                        <span
                                            className={styles.icon}
                                            style={{ color: icon.color }}
                                            dangerouslySetInnerHTML={{ __html: icon.svg }}
                                        />
                                    )}

                                    <span className={styles.tagName}>
                                        {item.title}
                                    </span>
                                </div>

                                <span className={styles.count}>{item.total}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TagPage;
