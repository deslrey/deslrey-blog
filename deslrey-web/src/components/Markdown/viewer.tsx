import { useEffect, useRef, useMemo, memo, useState, lazy } from "react";
import { Viewer as MdViewer } from "@bytemd/react";
import { plugins, hljs } from "./config";
import type { Article, BytemdViewerProps, TocItem } from "../../types";
import { CodeBlockEnhancer } from "../../utils/markdown";

import DetailHead from "../DetailHead";
import { useImagePreview } from "../ImagePreviewManager";
import FloatingButtons from "../FloatingButtons";

import "./index.scss";
import { useReadingTitle } from "../../hooks/useReadingTitle";
import ValineComment from "../ValineComment";

import { Suspense } from "react";

const MarkdownToc = lazy(() => import("../MarkdownToc"));
const ProfileCard = lazy(() => import("../ArticleSidebar/ProfileCard"));
const NoticeCard = lazy(() => import("../ArticleSidebar/NoticeCard"));
const LazyLoad = lazy(() => import("../LazyLoad"));

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

    // 内容后处理：生成 TOC + 图片加载态
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const headings = Array.from(
            container.querySelectorAll("h1, h2, h3, h4")
        );

        const nextToc = headings.map(el => {
                const level = Number(el.tagName[1]);

                if (!el.id) {
                    el.id =
                        el.textContent
                            ?.trim()
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^\w-]/g, "") ?? "";
                }

                return {
                    id: el.id,
                    text: el.textContent ?? "",
                    level,
                };
            });
        setToc(nextToc);

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

        nextToc.forEach(item => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
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
        let rafId = 0;
        const runPipeline = () => {
            enhancer.enhance();
            container
                .querySelectorAll("pre code:not([data-highlighted])")
                .forEach(block =>
                    hljs.highlightElement(block as HTMLElement)
                );
        };
        rafId = requestAnimationFrame(runPipeline);
        let queued = false;
        const observer = new MutationObserver(() => {
            if (queued) return;
            queued = true;
            rafId = requestAnimationFrame(() => {
                queued = false;
                runPipeline();
            });
        });

        observer.observe(container, { childList: true, subtree: true });
        return () => {
            observer.disconnect();
            cancelAnimationFrame(rafId);
            enhancer.dispose();
        };
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
        tags: article.tags
    };

    return (
        <div className="bytemdViewer">
            <div className="article-container">
                <main className="markdown-content">
                    <DetailHead data={headData} carouseUrl={carouseUrl} />
                    <div ref={containerRef} className="markdown-div">
                        <MemoMdViewer content={content} />
                    </div>
                    <div className="comment-wrapper">
                        <Suspense fallback={<div className="comment-placeholder">评论加载中...</div>}>
                            <LazyLoad threshold={0.01}>
                                <ValineComment article={article} />
                            </LazyLoad>
                        </Suspense>
                    </div>
                </main>

                <aside className="article-sidebar">
                    <Suspense fallback={<div className="sidebar-placeholder" style={{ height: '200px' }} />}>
                        <ProfileCard />
                    </Suspense>
                    <Suspense fallback={<div className="sidebar-placeholder" style={{ height: '150px' }} />}>
                        <NoticeCard />
                    </Suspense>
                    <div className="sidebar-sticky">
                        <MarkdownToc
                            toc={toc}
                            activeId={activeId}
                            open={tocOpen}
                            onClose={() => setTocOpen(false)}
                        />
                    </div>
                </aside>
            </div>

            {tocOpen && (
                <div
                    ref={maskRef}
                    className="toc-mask"
                    onClick={() => setTocOpen(false)}
                />
            )}

            <ImagePreview />
            <FloatingButtons
                title={article.title}
                onTocClick={() => setTocOpen(true)}
            />
        </div>
    );
};


export default BytemdViewer;
