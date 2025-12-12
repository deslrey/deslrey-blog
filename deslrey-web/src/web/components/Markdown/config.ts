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

// --- 按需加载需要的语言 ---
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import java from "highlight.js/lib/languages/java";
import go from "highlight.js/lib/languages/go";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import scss from "highlight.js/lib/languages/scss";
import shell from "highlight.js/lib/languages/shell";
import json from "highlight.js/lib/languages/json";
import sql from "highlight.js/lib/languages/sql";

// --- 注册语言 ---
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("java", java);
hljs.registerLanguage("go", go);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("scss", scss);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("json", json);
hljs.registerLanguage("sql", sql);

hljs.configure({ ignoreUnescapedHTML: true });

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

export { hljs };
