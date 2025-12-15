import { Viewer as MdViewer } from "@bytemd/react";
import { plugins } from "./config";
import type { Article, BytemdViewerProps, TocItem } from "../../../interfaces";
import { CodeBlockEnhancer } from "../../../utils/codeBlockEnhancer";
const DetailHead = lazy(() => import('../DetailHead'))

import { hljs } from "./config";
import "./index.scss";
import { useEffect, useRef, useMemo, memo, useState, lazy } from "react";
import { useImagePreview } from "../ImagePreviewManager";
const MarkdownToc = lazy(() => import('../MarkdownToc'))
import { TableOfContents } from "lucide-react";


const MemoMdViewer = memo(({ content }: { content: string }) => {

    return <MdViewer value={content} plugins={plugins} />;
});

const BytemdViewer = ({ article, carouseUrl }: BytemdViewerProps) => {
    console.log("start");

    const containerRef = useRef<HTMLDivElement | null>(null);

    const [toc, setToc] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [tocOpen, setTocOpen] = useState(false);

    const { setImage, ImagePreview } = useImagePreview();

    const content = useMemo(() => article.content as string, [article.content]);

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


    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const headings = Array.from(
            container.querySelectorAll("h1, h2, h3, h4")
        );

        const tocItems: TocItem[] = headings.map((el) => {
            const level = Number(el.tagName[1]);
            let id = el.id;

            // 兜底：如果没有 id，自己生成一个
            if (!id) {
                id =
                    el.textContent
                        ?.trim()
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^\w\-]/g, "") ?? "";
                el.id = id;
            }

            return {
                id,
                text: el.textContent ?? "",
                level,
            };
        });

        console.log('toc======> ', tocItems)

        setToc(tocItems);
    }, [content]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !toc.length) return;

        const headings = toc
            .map((item) => document.getElementById(item.id))
            .filter(Boolean) as HTMLElement[];

        const observer = new IntersectionObserver(
            (entries) => {
                // 只取进入视口的
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top
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

        headings.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [toc]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const imgs = container.querySelectorAll("img");

        imgs.forEach((img) => {
            // 标记为 loading
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

    // 图片点击事件
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName.toLowerCase() !== "img") return;

            setImage(target as HTMLImageElement);
        };

        container.addEventListener("click", handleClick);
        return () => container.removeEventListener("click", handleClick);
    }, [setImage]);

    // 代码块增强 & 高亮
    useEffect(() => {
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

    const maskRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const html = document.documentElement;

        if (tocOpen) {
            html.style.overflow = "hidden";
        } else {
            html.style.overflow = "";
        }

        return () => {
            html.style.overflow = "";
        };
    }, [tocOpen]);

    console.log("end");

    return (
        <div className="markdown-layout">
            <div className="markdown-content">
                <DetailHead data={headData} carouseUrl={carouseUrl} />
                <div ref={containerRef} className="card-div">
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
    );
};

export default BytemdViewer;
