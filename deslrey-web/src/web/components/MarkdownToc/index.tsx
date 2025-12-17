import { CircleX } from "lucide-react";
import type { TocProps } from "../../../interfaces";

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

    return (
        <aside className={`markdown-div markdown-toc ${open ? "open" : ""}`}>
            <div className="markdown-toc-title">
                目录
                <span className="toc-close" onClick={onClose}>
                    <CircleX />
                </span>

            </div>

            <ul>
                {toc.map((item) => (
                    <li
                        key={item.id}
                        className={`lv-${item.level} ${activeId === item.id ? "active" : ""
                            }`}
                    >
                        <a href={`#${item.id}`} onClick={(e) => handleClick(e, item.id)}>
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default MarkdownToc;