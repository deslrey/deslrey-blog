import * as simpleIcons from 'simple-icons';
import {
    siJavascript,
    siTypescript,
    siPython,
    siOpenjdk,
    siCplusplus,
    siReact,
    siVuedotjs,
    siGo,
    siRust,
    siPhp,
    siKotlin,
    siShell,
    siYaml,
    siMysql,
    siRedis,
    siCss,
    siSass
} from 'simple-icons';
import { Message } from './message';


type CodeBlockEnhancerOptions = {
    container: HTMLElement;
};

export class CodeBlockEnhancer {
    private container: HTMLElement;
    private langMap: Record<string, any>;

    constructor(options: CodeBlockEnhancerOptions) {
        this.container = options.container;

        // 常用编程语言映射表
        this.langMap = {
            javascript: siJavascript,
            typescript: siTypescript,
            react: siReact,
            vue: siVuedotjs,
            python: siPython,
            java: siOpenjdk,
            cpp: siCplusplus,
            c: siCplusplus,
            go: siGo,
            rust: siRust,
            php: siPhp,
            shell: siShell,
            kotlin: siKotlin,
            redis: siRedis,
            yaml: siYaml,
            mysql: siMysql,
            css: siCss,
            sass: siSass,
            scss: siSass
        };
    }

    public enhance() {
        const blocks = Array.from(
            this.container.querySelectorAll('pre > code')
        ) as HTMLElement[];

        for (const codeEl of blocks) {
            const pre = codeEl.parentElement as HTMLElement | null;
            if (!pre || pre.getAttribute('data-enhanced') === 'true') continue;

            this.addLanguageBadge(pre, codeEl);
            this.addCopyButton(pre, codeEl);

            pre.setAttribute('data-enhanced', 'true');
        }
    }

    private addLanguageBadge(pre: HTMLElement, codeEl: HTMLElement) {
        const className = codeEl.className || '';
        const match = className.match(/language-([a-z0-9+#-]+)/i);
        const lang = (match?.[1] || '').toLowerCase();

        if (!lang) return;

        const badge = document.createElement('span');
        badge.className = 'code-lang-badge';

        const icon = this.langMap[lang] || (simpleIcons as any)[lang];

        if (icon) {
            badge.innerHTML = icon.svg;

            const svgEl = badge.querySelector('svg');
            if (svgEl) {
                svgEl.setAttribute('width', '20');
                svgEl.setAttribute('height', '20');
                svgEl.setAttribute('fill', `#${icon.hex}`);
            }
        } else {
            badge.textContent = lang.toUpperCase();
            badge.style.color = '#555';
        }

        pre.appendChild(badge);
    }

    private addCopyButton(pre: HTMLElement, codeEl: HTMLElement) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'code-copy-btn';
        btn.setAttribute('aria-label', '复制代码');

        btn.style.background = 'transparent';
        btn.style.border = 'none';
        btn.style.padding = '0';
        btn.style.cursor = 'pointer';
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.color = 'var(--color-text)';

        // 复制图标
        const copyIcon = `
    <svg class="icon" viewBox="0 0 1024 1024" width="20" height="20" fill="currentColor">
        <path d="M720 192h-544A80.096 80.096 0 0 0 96 272v608C96 924.128 131.904 960 176 960h544c44.128 0 80-35.872 80-80v-608C800 227.904 764.128 192 720 192z m16 688c0 8.8-7.2 16-16 16h-544a16 16 0 0 1-16-16v-608a16 16 0 0 1 16-16h544a16 16 0 0 1 16 16v608z"></path>
        <path d="M848 64h-544a32 32 0 0 0 0 64h544a16 16 0 0 1 16 16v608a32 32 0 1 0 64 0v-608C928 99.904 892.128 64 848 64z"></path>
        <path d="M608 360H288a32 32 0 0 0 0 64h320a32 32 0 1 0 0-64zM608 520H288a32 32 0 1 0 0 64h320a32 32 0 1 0 0-64zM480 678.656H288a32 32 0 1 0 0 64h192a32 32 0 1 0 0-64z"></path>
    </svg>`;

        // 成功图标
        const successIcon = `
    <svg class="icon" viewBox="0 0 1024 1024" width="20" height="20" fill="currentColor">
        <path d="M384 768L128 512l60.8-60.8L384 646.4 835.2 195.2 896 256z"/>
    </svg>`;

        btn.innerHTML = copyIcon;

        const getCodeText = () => codeEl.textContent ?? '';
        btn.addEventListener('click', async () => {
            const text = getCodeText();
            try {
                await navigator.clipboard.writeText(text);
            } catch {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            btn.innerHTML = successIcon;
            Message.success('复制成功');

            setTimeout(() => {
                btn.innerHTML = copyIcon;
            }, 5000);
        });

        pre.appendChild(btn);
    }


}
