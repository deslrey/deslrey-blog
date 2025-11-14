const baseUrl = "http://localhost:8080/deslrey";

export const api = {

    carouselPage: {
        sex: baseUrl + "/carousel/sex",
        scenery: baseUrl + "/carousel/scenery"
    },

    article: {
        LatestReleases: baseUrl + '/article/LatestReleases',
        articleList: baseUrl + '/article/list',
        articleDetail: baseUrl + '/article/articleDetail/'
    },

    category: {
        categoryCount: baseUrl + '/category/categoryCount',
        categoryArticle: baseUrl + '/category/'
    },

    tag: {
        tagCount: baseUrl + '/tag/tagCount',
        tagArticle: baseUrl + '/tag/'
    }

}