import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export const useImagePreview = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    /* ------------------ 锁定页面滚动 ------------------ */
    useEffect(() => {
        if (!image) return;

        const scrollY = window.scrollY;

        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";

        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            window.scrollTo(0, scrollY);
        };
    }, [image]);

    /* ------------------ ImagePreview 组件 ------------------ */
    const ImagePreview = () =>
        image
            ? createPortal(
                <div
                    className="image-preview-mask"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setImage(null);
                        }
                    }}                >
                    <TransformWrapper
                        initialScale={1}
                        minScale={0.5}
                        maxScale={5}
                        wheel={{ step: 0.12 }}
                        pinch={{ step: 6 }}
                        doubleClick={{ disabled: true }}
                        panning={{ velocityDisabled: true }}
                    >
                        <TransformComponent>
                            <img
                                src={image.src}
                                alt={image.alt || ""}
                                onClick={(e) => e.stopPropagation()}
                                draggable={false}
                                style={{
                                    maxWidth: "90vw",
                                    maxHeight: "90vh",
                                    userSelect: "none",
                                    touchAction: "none",
                                    cursor: "grab",
                                }}
                            />
                        </TransformComponent>
                    </TransformWrapper>
                </div>,
                document.body
            )
            : null;

    return { setImage, ImagePreview };
};
