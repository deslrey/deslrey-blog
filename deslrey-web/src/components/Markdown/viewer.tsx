"use client";

import * as React from "react";
import { Viewer } from "@bytemd/react";
import { plugins } from "./config";

// import "./index.scss";
import { CodeBlockEnhancer } from "@/util/codeBlockEnhancer";
import { Article } from "@/interfaces/Article";
import DetailHead from "../DetailHead";

interface BytemdViewerProps {
    article: Article;
}

export const BytemdViewer = ({ article }: BytemdViewerProps) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const contentRef = React.useRef<HTMLDivElement | null>(null);

    const [headings, setHeadings] = React.useState<
        Array<{ id: string; text: string; level: number }>
    >([]);
    const [activeId, setActiveId] = React.useState<string>("");

    const content = article.content as string

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
        sticky: article.sticky
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

        const observer = new MutationObserver(() => enhancer.enhance());
        observer.observe(container, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [content]);


    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        requestAnimationFrame(() => {
            const headingEls = Array.from(container.querySelectorAll("h2, h3")) as HTMLElement[];
            if (!headingEls.length) return;

            const newHeadings = headingEls.map(h => ({
                id: h.id,
                text: h.textContent?.trim() || "",
                level: Number(h.tagName.substring(1)),
            }));
            setHeadings(newHeadings);

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setActiveId(entry.target.id);
                        }
                    });
                },
                { root: null, rootMargin: "-40% 0px -60% 0px", threshold: 0 }
            );

            headingEls.forEach(el => observer.observe(el));

            return () => observer.disconnect();
        });
    }, [content]);


    const scrollToHeading = React.useCallback((id: string) => {
        const el = document.getElementById(id);
        if (!el) return;

        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);




    return (
        <div className="markdown-layout">

            <div className="markdown-content" ref={contentRef}>

                <DetailHead data={headData} />
                <div ref={containerRef} >
                    <Viewer value={content} plugins={plugins} />
                </div>
            </div>
            <aside className="markdown-toc">
                <ul>
                    {headings.length > 0
                        ? headings.map((h) => (
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
                        : Array(5)
                            .fill(0)
                            .map((_, i) => (
                                <li key={i} className="skeleton">
                                    <span />
                                </li>
                            ))}
                </ul>
                <a href="#top" onClick={handleScrollToTop}>
                    回到顶部
                </a>
            </aside>

        </div>
    );
};
