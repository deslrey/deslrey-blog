import { Viewer as MdViewer } from "@bytemd/react";
import { plugins } from "./config";
import type { Article } from "../../../interfaces";
import { CodeBlockEnhancer } from "../../../utils/codeBlockEnhancer";
import DetailHead from "../DetailHead";

import { hljs } from "./config";
import "./index.scss";
import { useEffect, useRef, useMemo, memo } from "react";
import { useImagePreview } from "../ImagePreviewManager";

interface BytemdViewerProps {
    article: Article;
    carouseUrl: string;
}

const MemoMdViewer = memo(({ content }: { content: string }) => {
    return <MdViewer value={content} plugins={plugins} />;
});

export const BytemdViewer = ({ article, carouseUrl }: BytemdViewerProps) => {
    console.log("start");

    const containerRef = useRef<HTMLDivElement | null>(null);

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

    console.log("end");

    return (
        <div className="markdown-layout">
            <div className="markdown-content">
                <DetailHead data={headData} carouseUrl={carouseUrl} />
                <div ref={containerRef} className="card-div">
                    <MemoMdViewer content={content} />
                </div>
            </div>

            <ImagePreview />
        </div>
    );
};
