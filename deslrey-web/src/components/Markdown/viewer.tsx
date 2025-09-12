"use client";

import * as React from "react";
import { Viewer } from "@bytemd/react";
import { plugins } from "./config";

import { Progress } from "antd";
import type { ProgressProps } from "antd";

import "./index.css";
import { CodeBlockEnhancer } from "@/util/codeBlockEnhancer";

interface BytemdViewerProps {
    body: string;
}

const conicColors: ProgressProps["strokeColor"] = {
    "0%": "#87d068",
    "50%": "#ffe58f",
    "100%": "#ffccc7",
};

export const BytemdViewer = ({ body }: BytemdViewerProps) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const contentRef = React.useRef<HTMLDivElement | null>(null);

    const [headings, setHeadings] = React.useState<
        Array<{ id: string; text: string; level: number }>
    >([]);
    const [activeId, setActiveId] = React.useState<string>("");
    const [progress, setProgress] = React.useState<number>(0);

    //抽出来 供 scroll 和 回到顶部 都能用
    const getScrollParent = (
        element: HTMLElement | null
    ): HTMLElement | Window => {
        if (!element) return window;

        let parent = element.parentElement;
        while (parent) {
            const { overflow, overflowY } = window.getComputedStyle(parent);
            if (/(auto|scroll)/.test(overflow + overflowY)) {
                return parent;
            }
            parent = parent.parentElement;
        }
        return window;
    };

    const handleScrollToTop = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        const scrollContainer = getScrollParent(contentRef.current);
        if (scrollContainer === window) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            (scrollContainer as HTMLElement).scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const enhancer = new CodeBlockEnhancer({ container });
        enhancer.enhance();

        const observer = new MutationObserver(() => enhancer.enhance());
        observer.observe(container, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [body]);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // === 生成目录 ===
        const headingEls = Array.from(
            container.querySelectorAll("h2, h3")
        ) as HTMLElement[];
        const newHeadings: Array<{ id: string; text: string; level: number }> = [];

        for (const h of headingEls) {
            const raw = h.textContent?.trim() || "";
            const id = h.id; // rehype-slug 已经自动加好

            if (!id) continue;

            newHeadings.push({ id, text: raw, level: Number(h.tagName.substring(1)) });
        }

        setHeadings(newHeadings);

        // === 监听标题激活 ===
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = (entry.target as HTMLElement).id;
                        setActiveId(id);
                    }
                });
            },
            { rootMargin: "-40% 0px -40% 0px", threshold: [0, 1] }
        );
        headingEls.forEach((el) => observer.observe(el));

        return () => {
            observer.disconnect();
        };
    }, [body]);


    function slugify(text: string, index: number): string {
        return (
            text
                .toLowerCase()
                .trim()
                .replace(/[\.（）\(\)]/g, "-")   // 替换掉点和括号
                .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, "") // 只保留字母数字和中文
                .replace(/-+/g, "-")            // 合并多个 -
                .replace(/^-|-$/g, "")          // 去掉开头/结尾的 -
            || `heading-${index + 1}`           // 兜底
        );
    }


    // 单独的 useEffect 处理滚动进度
    React.useEffect(() => {
        const scrollContainer = getScrollParent(contentRef.current);

        const onScroll = () => {
            let scrollTop: number, scrollHeight: number, clientHeight: number;

            if (scrollContainer === window) {
                scrollTop = window.scrollY || document.documentElement.scrollTop;
                scrollHeight = document.documentElement.scrollHeight;
                clientHeight = window.innerHeight;
            } else {
                const el = scrollContainer as HTMLElement;
                scrollTop = el.scrollTop;
                scrollHeight = el.scrollHeight;
                clientHeight = el.clientHeight;
            }

            if (scrollHeight > clientHeight) {
                const total = Math.max(1, scrollHeight - clientHeight);
                const percent = (scrollTop / total) * 100;
                setProgress(Math.round(percent));
            } else {
                setProgress(0);
            }
        };

        onScroll();
        scrollContainer.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            scrollContainer.removeEventListener("scroll", onScroll);
        };
    }, []);


    const scrollToHeading = React.useCallback((id: string) => {
        const el = document.getElementById(id);
        if (!el) return;

        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    return (
        <div className="layout">
            <div className="content" ref={contentRef}>
                <div ref={containerRef} className="markdown-body">
                    <Viewer value={body} plugins={plugins} />
                </div>
            </div>
            {headings.length > 0 && (
                <aside className="markdown-toc">
                    {/* <div className="markdown-toc-title">目录</div> */}
                    <ul>
                        {headings.map((h) => (
                            <li
                                key={h.id}
                                className={`lv-${h.level} ${activeId === h.id ? "active" : ""}`}
                            >
                                <a
                                    href={`#${h.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToHeading(h.id);
                                    }}
                                >
                                    {h.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="markdown-toc-progress">
                        <Progress
                            type="circle"
                            percent={progress}
                            size={20}
                            showInfo={false}
                            strokeColor={conicColors}
                        />
                        <span className="dot" /> {progress}%
                    </div>
                    <a className="markdown-toc-top" href="#top" onClick={handleScrollToTop}>
                        回到顶部
                    </a>
                </aside>
            )}
        </div>
    );
};
