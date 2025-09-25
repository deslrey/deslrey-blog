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

export interface Draft {
    id: number;
    title: string;
    content: string;
    des: string
    createTime: Date;
    updateTime: Date;
}

export interface ArticleDraft {
    id: number;
    title: string;
    content: string;
    categoryPO: Category;
    tagIdList: number[];
    des: string;
}

export interface Category {
    id: number;
    categoryTitle: string;
    createTime?: Date
}

export interface Folder {
    id: number;
    folderName: string;
    path: string;
    createTime: Date
}

export interface Image {
    id: number;
    folderName: string;
    imageName: string;
    path: string;
    url: string;
    size: number;
    createTime: Date;
}

export type User = {
    token: string | null;
    userName: string | null;
    email: string | null;
    avatar: string | null;
};

export interface Tag {
    id: number;
    tagTitle: string;
    createTime: Date
}

export const OperateType = {
    article: 'article',
    draft: 'draft'
}

export const ListType = {
    all: "all",
    modicum: "modicum"
}

export type Order = 'asc' | 'desc';
