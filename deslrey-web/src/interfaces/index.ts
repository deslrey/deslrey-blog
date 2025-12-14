export interface Article {
    id: number;
    title: string;
    des: string;
    createTime: Date;
    edit: boolean;
    wordCount: number;
    readTime: number;
    sticky: boolean;
    views?: number;
    updateTime?: Date;
    category?: string;
    content?: string;
    exist?: boolean
}

export interface CountType {
    id: number;
    title: string;
    total: number;
}

export interface BytemdViewerProps {
    article: Article;
    carouseUrl: string;
}

export interface TocItem {
    id: string;
    text: string;
    level: number;
}

export interface TocProps {
    toc: TocItem[];
    activeId: string | null;
    open?: boolean;
    onClose?: () => void;
}
