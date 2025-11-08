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