export const loginApi = {
    login: '/user/login'
}

export const registerApi = {
    register: '/user/register'
}

export const addArticleApi = {
    addArticle: '/article/addArticle',
    categoryArticleList: '/category/categoryArticleList',
    tagNameList: '/tag/tagNameList',
    addDraft: '/draft/addDraft',
};

export const articleApi = {
    list: "/article/list",
    viewHot: "/article/viewHot"
}

export const categoryApi = {
    categoryList: '/category/categoryList',
    updateCategoryTitle: '/category/updateCategoryTitle',
    addCategory: '/category/addCategory',
}

export const draftApi = {
    draftList: "/draft/draftList",
    deleteDraft: "/draft/deleteDraft",
}

export const editArticleApi = {
    addArticle: '/article/addArticle',
    tagNameList: '/tag/tagNameList',
    editArticle: '/article/editArticle',
    addDraft: '/draft/addDraft',
    draftDetail: '/draft/detail',
    updateDraft: '/draft/updateDraft',
    categoryArticleList: '/category/categoryArticleList',
}

export const folderApi = {
    list: '/folder/list',
    addFolder: '/folder/addFolder',
    updateFolder: '/folder/updateFolder',
}

export const imageApi = {
    list: '/image/list',
    obscureFolderName: '/image/obscure',
    uploadImage: '/image/uploadImage',
    folderNameList: '/folder/folderNameList'
}

export const tagApi = {
    tagList: '/tag/tagList',
    addTag: '/tag/addTag',
    updateTagTitle: '/tag/updateTagTitle',
}

export const userApi = {
    updatePassword: '/user/updatePassword',
    updateUserName: '/user/updateUserName',
}