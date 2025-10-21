
const baseUrl = "http://localhost:8080/deslrey/public";

export const api = {
    archive: {
        archiveList: baseUrl + "/article/archiveList"
    },

    article: {
        articleList: baseUrl + "/article/articles"
    },

    articleDateil: {
        detail: baseUrl + "/article/detail"
    },

    classify: {
        categoryCountList: baseUrl + "/category/categoryCountList"
    },

    latestReleases: {
        articleList: baseUrl + "/article/LatestReleases"
    },

    popularTags: {
        tagCountList: baseUrl + "/tag/tagCountList"
    },

    tagPage: {
        articleTagsByTitle: baseUrl + "/tag/selectTagsByTitle"
    },

    categoryPage: {
        articleByTitle: baseUrl + "/category/articleByTitle"
    },
    
    detailHeadPage: {
        sex: baseUrl + "/carousel/sex",
        scenery: baseUrl + "/carousel/scenery"
    }
}