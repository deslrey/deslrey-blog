"use client";

import React, { useEffect, useState } from "react";
import { BytemdViewer } from "@/components/Markdown/viewer";
import { api } from "@/api";
import styles from "./index.module.scss";
import LoadComponent from "@/components/Loading/LoadComponent";

export default function BlogPage({ slug }: { slug: string }) {
    const [post, setPost] = useState<any>(null);
    const [carouseUrl, setCarouseUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setFadeOut(false);

                const start = Date.now();

                const [postRes] = await Promise.all([
                    fetch(`${api.articleDateil.detail}/${slug}`, { cache: "no-store" })]);
                // const [postRes, carouselRes] = await Promise.all([
                //     fetch(`${api.articleDateil.detail}/${slug}`, { cache: "no-store" }),
                //     fetch(`${api.detailHeadPage.scenery}`, { cache: "no-store" }),
                // ]);

                const postJson = await postRes.json();
                // const carouselJson = await carouselRes.json();

                setPost(postJson.data);
                // setCarouseUrl(carouselJson.data || "");

                // 🕒 确保动画至少显示 300ms
                const elapsed = Date.now() - start;
                if (elapsed < 300) {
                    await new Promise((r) => setTimeout(r, 300 - elapsed));
                }

                // 先淡出再关闭
                setFadeOut(true);
                setTimeout(() => setLoading(false), 300);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className={`${styles.loaderWrapper} ${fadeOut ? styles.fadeOut : ""}`}>
                <LoadComponent />
            </div>
        );
    }

    if (!post) {
        return <div className={styles.error}>文章加载失败</div>;
    }

    return (
        <div className={styles.blogBox}>
            <BytemdViewer article={post} carouseUrl={carouseUrl} />
        </div>
    );
}
