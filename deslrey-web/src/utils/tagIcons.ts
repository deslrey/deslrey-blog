import { siOpenjdk, siJavascript, siGin } from 'simple-icons';

type IconInfo = {
    svg: string;
    color: string;
};

const tagIcons: Record<string, IconInfo> = {
    Java: { svg: siOpenjdk.svg, color: `#${siOpenjdk.hex}` },
    JavaScript: { svg: siJavascript.svg, color: `#${siJavascript.hex}` },
    Gin: { svg: siGin.svg, color: `#${siGin.hex}` },
};

export const getTagIcon = (title: string): IconInfo | null => {
    const key = title;
    return tagIcons[key] || null;
};
