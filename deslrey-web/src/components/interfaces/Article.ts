export interface Article {
    id: number;
    title: string;
    des: string;
    createTime: Date;
    edit: boolean;
    wordCount: number;
    readTime: number;
    sticky: boolean;
}
