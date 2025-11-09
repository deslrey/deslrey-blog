import breaks from "@bytemd/plugin-breaks";
import frontmatter from "@bytemd/plugin-frontmatter";
import gfm from "@bytemd/plugin-gfm";
import gfm_zhHans from "@bytemd/plugin-gfm/lib/locales/zh_Hans.json";
import highlight from "@bytemd/plugin-highlight";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { BytemdPlugin } from "bytemd";

import hljs from "highlight.js/lib/core";
import asciidoc from "highlight.js/lib/languages/asciidoc";
import dart from "highlight.js/lib/languages/dart";
import nginx from "highlight.js/lib/languages/nginx";

hljs.registerLanguage("asciidoc", asciidoc);
hljs.registerLanguage("dart", dart);
hljs.registerLanguage("nginx", nginx);

export const plugins: BytemdPlugin[] = [
  breaks(),
  frontmatter(),
  mediumZoom(),
  gfm({ locale: gfm_zhHans }),
  highlight({ hljs } as any), 
  {
    rehype: ((processor: any) =>
      processor.use(rehypeSlug).use(rehypeAutolinkHeadings, { behavior: "append" })
    ) as BytemdPlugin["rehype"],
  },
];
