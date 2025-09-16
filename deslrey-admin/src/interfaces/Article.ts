export interface ArticleTpye {
    id: number;
    title: string;
    content: string;
    wordCount: number;
    views: number;
    createTime: Date;
    updateTime: Date;
    category: string;
    des: string;
    sticky: boolean;
    edit: boolean;
    exist: boolean;
}