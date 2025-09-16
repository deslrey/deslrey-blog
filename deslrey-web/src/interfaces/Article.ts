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

export interface Classify {
    title: string;
    total: number;
}

export interface LatestReleasesVO {
    id: number;
    title: string;
    createTime: Date;
}

export interface Tag {
    title: string;
    total: number;
}


export interface ArchiveVO {
    id: number;
    title: string;
    createTime: Date;
    edit: boolean;
}


export interface CategoryVO {
    id: number;
    title: string;
    total: number;
}

export interface TagVO {
    id: number;
    title: string;
    total: number;
}