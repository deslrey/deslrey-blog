import breaks from "@bytemd/plugin-breaks";
import frontmatter from "@bytemd/plugin-frontmatter";
import gfm from "@bytemd/plugin-gfm";
import gfm_zhHans from "@bytemd/plugin-gfm/lib/locales/zh_Hans.json";
import highlightSSR from "@bytemd/plugin-highlight-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import { common } from "lowlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import asciidoc from "highlight.js/lib/languages/asciidoc";
import dart from "highlight.js/lib/languages/dart";
import nginx from "highlight.js/lib/languages/nginx";
import { BytemdPlugin } from "bytemd";

export const plugins: BytemdPlugin[] = [
    breaks(),
    frontmatter(),
    mediumZoom(),
    gfm({ locale: gfm_zhHans }),
    highlightSSR({
        languages: {
            ...common,
            dart,
            nginx,
            asciidoc,
        },
    }),
    {
        rehype: ((processor: any) =>
            processor.use(rehypeSlug).use(rehypeAutolinkHeadings, { behavior: "append" })
        ) as BytemdPlugin["rehype"],
    },
];
