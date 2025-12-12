import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export const useImagePreview = () => {
    const [src, setSrc] = useState<string | null>(null);

    // 页面滚动锁定
    useEffect(() => {
        if (!src) return;
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";

        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            window.scrollTo(0, scrollY);
        };
    }, [src]);

    const ImagePreview = () =>
        src
            ? createPortal(
                <div className="image-preview-mask" onClick={() => setSrc(null)}>
                    <img src={src} onClick={(e) => e.stopPropagation()} />
                </div>,
                document.body
            )
            : null;

    return { setSrc, ImagePreview };
};
