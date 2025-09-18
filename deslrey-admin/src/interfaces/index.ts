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

export interface Category {
    id: number;
    categoryTitle: string;
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

export const OperateType = {
    add: "add",
    edit: "edit",
    draft: "draft",
}
