import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { X } from "lucide-react";

const DRAG_THRESHOLD_PX = 8;

const zoomWrapperStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const zoomContentStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
};

const closePreview = (setImage: (v: HTMLImageElement | null) => void) => {
    setImage(null);
};

export const useImagePreview = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const dragRef = useRef({ downX: 0, downY: 0, moved: false });

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

    /* ------------------ 区分点击与拖拽：只有未拖拽时点击空白才关闭 ------------------ */
    useEffect(() => {
        if (!image) return;

        const onPointerMove = (e: PointerEvent) => {
            const { downX, downY } = dragRef.current;
            const dx = e.clientX - downX;
            const dy = e.clientY - downY;
            if (dx * dx + dy * dy > DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
                dragRef.current.moved = true;
            }
        };

        window.addEventListener("pointermove", onPointerMove);
        return () => window.removeEventListener("pointermove", onPointerMove);
    }, [image]);

    /* ------------------ ImagePreview 组件 ------------------ */
    const ImagePreview = () =>
        image
            ? createPortal(
                <div
                    className="image-preview-mask"
                    onPointerDown={(e) => {
                        dragRef.current = {
                            downX: e.clientX,
                            downY: e.clientY,
                            moved: false,
                        };
                    }}
                >
                    {/* 点击空白区域（非图片）关闭；拖拽图片后松手不关闭 */}
                    <div
                        className="image-preview-backdrop"
                        onClick={(e) => {
                            if ((e.target as HTMLElement).closest(".image-preview-img")) return;
                            if (dragRef.current.moved) return;
                            closePreview(setImage);
                        }}
                        aria-hidden
                    >
                        <div className="image-preview-zoom-wrapper">
                            <TransformWrapper
                                initialScale={1}
                                minScale={0.5}
                                maxScale={8}
                                wheel={{ step: 0.15 }}
                                pinch={{ step: 8 }}
                                doubleClick={{ disabled: true }}
                                panning={{ velocityDisabled: true }}
                            >
                                <TransformComponent
                                    wrapperStyle={zoomWrapperStyle}
                                    contentStyle={zoomContentStyle}
                                >
                                    <img
                                    src={image.src}
                                    alt={image.alt || ""}
                                    onClick={(e) => e.stopPropagation()}
                                    draggable={false}
                                    className="image-preview-img"
                                    style={{
                                        maxWidth: "90vw",
                                        maxHeight: "90vh",
                                        width: "auto",
                                        height: "auto",
                                        objectFit: "contain",
                                        userSelect: "none",
                                        touchAction: "none",
                                        cursor: "grab",
                                    }}
                                />
                                </TransformComponent>
                            </TransformWrapper>
                        </div>
                    </div>
                    {/* 关闭按钮，确保一定能退出预览 */}
                    <button
                        type="button"
                        className="image-preview-close"
                        onClick={() => closePreview(setImage)}
                        aria-label="关闭图片预览"
                    >
                        <X size={24} strokeWidth={2} />
                    </button>
                </div>,
                document.body
            )
            : null;

    return { setImage, ImagePreview };
};
