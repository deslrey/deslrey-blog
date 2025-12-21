import {
    siOpenjdk,
    siJavascript,
    siGin,
    siGo,
    siVite,
    siDocker,
    siLinux,
    siNeo4j,
    siRedis
} from 'simple-icons';

type IconInfo = {
    svg: string;
    color: string;
};

const tagIcons: Record<string, IconInfo> = {
    Java: { svg: siOpenjdk.svg, color: `#${siOpenjdk.hex}` },
    JavaScript: { svg: siJavascript.svg, color: `#${siJavascript.hex}` },
    Gin: { svg: siGin.svg, color: `#${siGin.hex}` },
    Go: { svg: siGo.svg, color: `#${siGo.hex}` },
    Vite: { svg: siVite.svg, color: `#${siVite.hex}` },
    Docker: { svg: siDocker.svg, color: `#${siDocker.hex}` },
    Linux: { svg: siLinux.svg, color: `#${siLinux.hex}` },
    Neo4j: { svg: siNeo4j.svg, color: `#${siNeo4j.hex}` },
    Redis: { svg: siRedis.svg, color: `#${siRedis.hex}` }
};

export const getTagIcon = (title: string): IconInfo | null => {
    return tagIcons[title] || null;
};
