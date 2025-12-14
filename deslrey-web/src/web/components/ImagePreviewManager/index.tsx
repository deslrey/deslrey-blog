import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export const useImagePreview = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    // 页面滚动锁定
    useEffect(() => {
        if (!image) return;

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
    }, [image]);

    const ImagePreview = () =>
        image
            ? createPortal(
                <div className="image-preview-mask" onClick={() => setImage(null)}>
                    <div
                        className="image-preview-content"
                        ref={(el) => {
                            if (!el) return;
                            el.innerHTML = "";
                            el.appendChild(image.cloneNode(true));
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>,
                document.body
            )
            : null;

    return { setImage, ImagePreview };
};
