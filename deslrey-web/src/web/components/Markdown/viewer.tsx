import { useEffect, useRef, useMemo, memo, useState, lazy } from "react";
import { Viewer as MdViewer } from "@bytemd/react";
import { plugins, hljs } from "./config";
import type { Article, BytemdViewerProps, TocItem } from "../../../interfaces";
import { CodeBlockEnhancer } from "../../../utils/codeBlockEnhancer";

import DetailHead from "../DetailHead";
import { useImagePreview } from "../ImagePreviewManager";
import { TableOfContents } from "lucide-react";

import "./index.scss";
import { useReadingTitle } from "../../hooks/useReadingTitle";

const MarkdownToc = lazy(() => import("../MarkdownToc"));

const MemoMdViewer = memo(({ content }: { content: string }) => {
    return <MdViewer value={content} plugins={plugins} />;
});

const BytemdViewer = ({ article, carouseUrl }: BytemdViewerProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const maskRef = useRef<HTMLDivElement | null>(null);

    const [toc, setToc] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [tocOpen, setTocOpen] = useState(false);

    const { setImage, ImagePreview } = useImagePreview();

    const content = useMemo(
        () => article.content as string,
        [article.content]
    );

    useReadingTitle(article.title, toc, activeId);

    // 生成 TOC
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const headings = Array.from(
            container.querySelectorAll("h1, h2, h3, h4")
        );

        setToc(
            headings.map(el => {
                const level = Number(el.tagName[1]);

                if (!el.id) {
                    el.id =
                        el.textContent
                            ?.trim()
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^\w\-]/g, "") ?? "";
                }

                return {
                    id: el.id,
                    text: el.textContent ?? "",
                    level,
                };
            })
        );
    }, [content]);

    // IntersectionObserver
    useEffect(() => {
        if (!toc.length) return;

        const observer = new IntersectionObserver(
            entries => {
                const visible = entries
                    .filter(e => e.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top -
                            b.boundingClientRect.top
                    );

                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            {
                rootMargin: "-80px 0px -60% 0px",
                threshold: 0,
            }
        );

        toc.forEach(item => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [toc]);

    //  图片加载状态
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const imgs = container.querySelectorAll("img");
        imgs.forEach(img => {
            img.classList.add("img-loading");

            if (img.complete) {
                img.classList.remove("img-loading");
                img.classList.add("img-loaded");
            } else {
                img.addEventListener(
                    "load",
                    () => {
                        img.classList.remove("img-loading");
                        img.classList.add("img-loaded");
                    },
                    { once: true }
                );
            }
        });
    }, [content]);

    //  图片点击预览
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName.toLowerCase() === "img") {
                setImage(target as HTMLImageElement);
            }
        };

        container.addEventListener("click", handleClick);
        return () => container.removeEventListener("click", handleClick);
    }, [setImage]);

    //  代码块增强 & 高亮
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const enhancer = new CodeBlockEnhancer({ container });
        enhancer.enhance();

        const highlight = () => {
            container
                .querySelectorAll("pre code:not([data-highlighted])")
                .forEach(block =>
                    hljs.highlightElement(block as HTMLElement)
                );
        };

        requestAnimationFrame(highlight);

        const observer = new MutationObserver(() => {
            enhancer.enhance();
            highlight();
        });

        observer.observe(container, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, [content]);

    //  TOC 打开时锁滚动
    useEffect(() => {
        document.documentElement.style.overflow = tocOpen ? "hidden" : "";
        return () => {
            document.documentElement.style.overflow = "";
        };
    }, [tocOpen]);

    //  Head 数据
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

    return (
        <div className="bytemdViewer">
            <DetailHead data={headData} carouseUrl={carouseUrl} />

            <div className="markdown-layout">
                <div className="markdown-content">
                    <div ref={containerRef} className="markdown-div">
                        <MemoMdViewer content={content} />
                    </div>
                </div>

                {tocOpen && (
                    <div
                        ref={maskRef}
                        className="toc-mask"
                        onClick={() => setTocOpen(false)}
                    />
                )}

                <MarkdownToc
                    toc={toc}
                    activeId={activeId}
                    open={tocOpen}
                    onClose={() => setTocOpen(false)}
                />

                <button
                    className="toc-fab"
                    onClick={() => setTocOpen(true)}
                >
                    <TableOfContents />
                </button>

                <ImagePreview />
            </div>
        </div>
    );
};

export default BytemdViewer;
