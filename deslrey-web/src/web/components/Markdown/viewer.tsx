import * as React from "react";
import { Viewer } from "@bytemd/react";
import { plugins } from "./config";
import type { Article } from "../../../interfaces";
import { CodeBlockEnhancer } from "../../../utils/codeBlockEnhancer";
import DetailHead from "../DetailHead";

import hljs from "highlight.js";
import "./index.scss";

hljs.configure({ ignoreUnescapedHTML: true });

interface BytemdViewerProps {
    article: Article;
    carouseUrl: string;
}

export const BytemdViewer = ({ article, carouseUrl }: BytemdViewerProps) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const contentRef = React.useRef<HTMLDivElement | null>(null);

    const [headings, setHeadings] = React.useState<
        Array<{ id: string; text: string; level: number }>
    >([]);
    const [activeId, setActiveId] = React.useState<string>("");

    const content = article.content as string;

    const headData: Article = {
        id: article.id,
        title: article.title,
        wordCount: article.wordCount,
        views: article.views,
        readTime: article.readTime,
        createTime: article.createTime,
        updateTime: article.updateTime,
        category: article.category,
        edit: article.edit,
        des: article.des,
        sticky: article.sticky,
    };

    const handleScrollToTop = (e?: React.MouseEvent) => {
        e?.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const enhancer = new CodeBlockEnhancer({ container });
        enhancer.enhance();

        const highlightCode = () => {
            const blocks = container.querySelectorAll("pre code:not([data-highlighted])");
            blocks.forEach((block) => hljs.highlightElement(block as HTMLElement));
        };
        requestAnimationFrame(() => highlightCode());

        const observer = new MutationObserver(() => {
            enhancer.enhance();
            highlightCode();
        });

        observer.observe(container, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, [content]);

    // 生成目录 & 滚动定位
    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let headingEls: HTMLElement[] = [];
        let headingOffsets: { id: string; offsetTop: number }[] = [];
        let initialized = false;
        let stableTimer: any = null;

        /** 检测 DOM 是否 100ms 内不再变化 */
        const markStable = () => {
            clearTimeout(stableTimer);
            stableTimer = setTimeout(() => {
                if (!initialized) {
                    initTOC();
                    initialized = true;
                } else {
                    updateOffsets();
                }
            }, 120);
        };

        /** 初始化 TOC（只执行一次） */
        const initTOC = () => {
            headingEls = Array.from(container.querySelectorAll("h2, h3")) as HTMLElement[];

            setHeadings(
                headingEls.map((h) => ({
                    id: h.id,
                    text: h.textContent?.trim() || "",
                    level: Number(h.tagName.substring(1)),
                }))
            );

            updateOffsets();
            handleScroll();
        };

        /** 重新计算 offsetTop */
        const updateOffsets = () => {
            headingEls = Array.from(container.querySelectorAll("h2, h3")) as HTMLElement[];

            headingOffsets = headingEls.map((el) => ({
                id: el.id,
                offsetTop: el.getBoundingClientRect().top + window.scrollY,
            }));
        };

        /** 滚动高亮 */
        const handleScroll = () => {
            const scrollY = window.scrollY + 120;
            let currentId = headingOffsets[0]?.id;

            for (let i = 0; i < headingOffsets.length; i++) {
                const { id, offsetTop } = headingOffsets[i];
                if (scrollY >= offsetTop) currentId = id;
                else break;
            }

            setActiveId(currentId || "");
        };

        /** 监听 DOM 完成渲染 */
        const mo = new MutationObserver(() => {
            markStable();
        });
        mo.observe(container, {
            childList: true,
            subtree: true,
            attributes: true,
        });

        window.addEventListener("scroll", handleScroll);

        // 初始触发一次
        markStable();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            mo.disconnect();
            clearTimeout(stableTimer);
        };
    }, [content]);



    const scrollToHeading = React.useCallback((id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    return (
        <div className="markdown-layout">
            <div className="markdown-content" ref={contentRef}>
                <DetailHead data={headData} carouseUrl={carouseUrl} />
                <div ref={containerRef} className="card-div">
                    <Viewer value={content} plugins={plugins} />
                </div>
            </div>

            <aside className="markdown-toc card-div">
                目录:
                <ul>
                    {headings.length > 0 ? (
                        headings.map((h) => (
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
                        ))
                    ) : (
                        <li className="no-toc">暂无目录</li>
                    )}
                </ul>
                <a href="#top" onClick={handleScrollToTop}>
                    回到顶部
                </a>
            </aside>
        </div>
    );
};
