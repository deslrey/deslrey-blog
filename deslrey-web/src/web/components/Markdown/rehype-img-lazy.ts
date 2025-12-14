import { visit } from "unist-util-visit";

export function rehypeImgLazy() {
    let firstImage = true;

    return (tree: any) => {
        visit(tree, "element", (node) => {
            if (node.tagName !== "img") return;

            node.properties ||= {};

            // 首图立即加载，其余懒加载
            node.properties.loading = firstImage ? "eager" : "lazy";

            // 解码不阻塞主线程
            node.properties.decoding = "async";

            // 避免外链图片 Referer 问题
            node.properties.referrerPolicy = "no-referrer";

            firstImage = false;
        });
    };
}
