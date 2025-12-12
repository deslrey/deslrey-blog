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

// Memo MdViewer 避免无关 state 导致重新渲染
const MemoMdViewer = memo(({ content }: { content: string }) => {
    return <MdViewer value={content} plugins={plugins} />;
});

export const BytemdViewer = ({ article, carouseUrl }: BytemdViewerProps) => {
    console.log("start");

    const containerRef = useRef<HTMLDivElement | null>(null);

    // 使用 useImagePreview 管理图片预览
    const { setSrc: setPreviewSrc, ImagePreview } = useImagePreview();

    // 保证 content 引用稳定
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

    // 图片点击事件
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName.toLowerCase() === "img") {
                setPreviewSrc((target as HTMLImageElement).src);
            }
        };

        container.addEventListener("click", handleClick);
        return () => container.removeEventListener("click", handleClick);
    }, [setPreviewSrc]);

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
