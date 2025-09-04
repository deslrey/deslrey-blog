"use client";

import { useEffect, useState } from "react";

export default function ColorProvider({ children }: { children: React.ReactNode }) {
    const colors = [
        "#4d96ff", // 蓝
        "#ff922b", // 橙
        "#ffd93d", // 黄
        "#6bcB77", // 绿
        "#ff6b6b", // 红
        "#845ec2", // 紫
        "#ff77e9", // 粉
        "#00c9a7", // 青绿
        "#ffb347", // 橙黄
        "#9d4edd", // 深紫
    ];

    const colorsRGB = [
        "77,150,255",
        "255,146,43",
        "255,217,61",
        "107,203,119",
        "255,107,107",
        "132,94,194",
        "255,119,233",
        "0,201,167",
        "255,179,71",
        "157,78,221",
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const handler = () => setIndex(prev => (prev + 1) % colors.length);
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty("--activeColor", colors[index]);
        document.documentElement.style.setProperty("--activeColor-rgb", colorsRGB[index]);
    }, [index]);

    return <>{children}</>;
}
