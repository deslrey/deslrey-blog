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
            const slug = raw
                .toLowerCase()
                .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");
            const id = slug || `heading-${newHeadings.length + 1}`;

            // 关键修复：确保标题元素的ID和目录中使用的ID完全一致
            h.id = id;

            console.log('设置标题ID:', id, '标题文本:', raw);

            // 添加锚点
            if (!h.querySelector(".markdown-anchor")) {
                const a = document.createElement("a");
                a.href = `#${id}`;
                a.className = "markdown-anchor";
                a.textContent = "#";
                h.appendChild(a);
            }

            const level = Number(h.tagName.substring(1));
            // 确保newHeadings中存储的id与实际设置的id一致
            newHeadings.push({ id, text: raw, level });
        }
        console.log('生成的目录项:', newHeadings);
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
        const container = contentRef.current;
        if (!container) return;
        let el = document.getElementById(id);

        if (!el) return;

        const offset = 80; // 顶部偏移
        const rect = el.getBoundingClientRect();
        const scrollContainer = getScrollParent(contentRef.current);

        if (scrollContainer === window) {
            window.scrollTo({
                top: rect.top + window.scrollY - offset,
                behavior: "smooth",
            });
        } else {
            const containerEl = scrollContainer as HTMLElement;
            containerEl.scrollTo({
                top: rect.top + containerEl.scrollTop - offset,
                behavior: "smooth",
            });
        }
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
