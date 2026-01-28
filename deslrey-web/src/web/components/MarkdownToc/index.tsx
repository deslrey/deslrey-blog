import { CircleX } from "lucide-react";
import type { TocItem, TocProps } from "../../../interfaces";
import { useMemo } from "react";

const MarkdownToc = ({ toc, activeId, open, onClose }: TocProps) => {

    const handleClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault();

        const el = document.getElementById(id);
        if (!el) return;

        el.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

        history.replaceState(null, "", `#${id}`);
        onClose?.();
    };


    const getActiveH2Id = (toc: TocItem[], activeId: string | null) => {
        if (!activeId) return null;

        const index = toc.findIndex(item => item.id === activeId);
        if (index === -1) return null;

        // 向上找到最近的 level=2
        for (let i = index; i >= 0; i--) {
            if (toc[i].level === 2) {
                return toc[i].id;
            }
        }

        return null;
    };

    const activeH2Id = useMemo(
        () => getActiveH2Id(toc, activeId),
        [toc, activeId]
    );


    return (
        <aside className={`markdown-div markdown-toc ${open ? "open" : ""}`}>
            <div className="markdown-toc-title">
                目录
                <span className="toc-close" onClick={onClose}>
                    <CircleX />
                </span>

            </div>

            <ul>
                {toc.map((item, index) => {
                    // 一级标题永远显示
                    if (item.level === 2) {
                        return (
                            <li
                                key={item.id}
                                className={`lv-${item.level} ${activeId === item.id ? "active" : ""}`}
                            >
                                <a
                                    href={`#${item.id}`}
                                    onClick={(e) => handleClick(e, item.id)}
                                >
                                    {item.text}
                                </a>
                            </li>
                        );
                    }

                    // 二级以下：只在当前 h2 下才显示
                    if (item.level > 2 && activeH2Id) {
                        // 找它的父 h2
                        for (let i = index - 1; i >= 0; i--) {
                            if (toc[i].level === 2) {
                                if (toc[i].id === activeH2Id) {
                                    return (
                                        <li
                                            key={item.id}
                                            className={`lv-${item.level} ${activeId === item.id ? "active" : ""}`}
                                        >
                                            <a
                                                href={`#${item.id}`}
                                                onClick={(e) => handleClick(e, item.id)}
                                            >
                                                {item.text}
                                            </a>
                                        </li>
                                    );
                                }
                                break;
                            }
                        }
                    }

                    return null;
                })}
            </ul>
        </aside>
    );
};

export default MarkdownToc;