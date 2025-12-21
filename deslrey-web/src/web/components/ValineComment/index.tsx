import { useEffect, useRef } from "react";
import "./index.scss";

interface Props {
    article: {
        id: string | number;
        title: string;
    };
}

const ValineComment = ({ article }: Props) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        ref.current.innerHTML = "";

        import("valine").then((ValineModule: any) => {
            const Valine = ValineModule.default ?? ValineModule;

            new Valine({
                el: ref.current!,
                appId: import.meta.env.VITE_LEANCLOUD_APP_ID,
                appKey: import.meta.env.VITE_LEANCLOUD_APP_KEY,
                path: `/article/${article.id}`,
                placeholder: "欢迎评论～",
                avatar: "monsterid",
                recordIP: true,
                pageSize: 10,
                lang: "zh-CN",
            });
        });
    }, [article.id]);

    return (
        <div className="valine-wrapper">
            <h3 className="valine-title">评论</h3>
            <div ref={ref} />
        </div>
    );
};

export default ValineComment;
