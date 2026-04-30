package category

import (
	"deslrey-go/internal/biz/article"
	"deslrey-go/pkg/cache"
	"deslrey-go/pkg/logger"
	"deslrey-go/pkg/result"
	"deslrey-go/pkg/util"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func HandleCounts(ctx *gin.Context) {
	var list []TitleCount

	found, err := cache.Get(ctx, article.GetCategoryCountKey(), &list)
	if err != nil {
		logger.Logger.Warn("redis get category:count failed,", "err", err)
	}

	if found {
		if list == nil {
			list = []TitleCount{}
		}
		result.OkData(list).Send(ctx)
		return
	}

	list, err = SelectCounts()
	if err != nil {
		result.Fail().SendCode(http.StatusInternalServerError, ctx)
		return
	}

	if list == nil {
		list = []TitleCount{}
	}

	if err := cache.SetForever(ctx, article.GetCategoryCountKey(), list); err != nil {
		logger.Logger.Warn("redis set category:count failed", "err", err)
	}

	result.OkData(list).Send(ctx)
}

func HandleArticles(ctx *gin.Context) {
	categoryIdStr := ctx.Param("id")
	categoryId, err := strconv.Atoi(categoryIdStr)
	if err != nil {
		result.Fail().SendCode(http.StatusInternalServerError, ctx)
		return
	}

	page, size := util.GetPageParams(ctx)
	cacheKey := article.GetCategoryArticlesKey(categoryId, page, size)

	var pageInfo util.PageInfo[ArticleListItem]
	found, err := cache.Get(ctx, cacheKey, &pageInfo)
	if err != nil {
		logger.Logger.Warn("redis get category articles failed", "err", err, "key", cacheKey)
	}
	if found {
		result.OkData(pageInfo).Send(ctx)
		return
	}

	res, err := SelectArticles(categoryId, page, size)
	if err != nil {
		result.Fail().SendCode(http.StatusInternalServerError, ctx)
		return
	}

	if err := cache.SetForever(ctx, cacheKey, res); err != nil {
		logger.Logger.Warn("redis set category articles failed", "err", err, "key", cacheKey)
	}
	result.OkData(res).Send(ctx)
}

func HandleAddCategory(ctx *gin.Context) {
	var req AddCategoryRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		result.FailMsg("请求参数错误").SendCode(http.StatusBadRequest, ctx)
		return
	}

	if err := InsertCategory(req.Title); err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}

	// 清除文章相关缓存 (分类变化会影响文章列表中的分类统计)
	article.ClearArticleCache(ctx)
	_ = cache.DelByPrefix(ctx, "category:articles:")

	result.OkMsg("添加成功").Send(ctx)
}

func HandleUpdateCategoryTitle(ctx *gin.Context) {
	var req UpdateCategoryRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		result.FailMsg("请求参数错误").SendCode(http.StatusBadRequest, ctx)
		return
	}

	if err := UpdateCategoryTitle(req.ID, req.Title); err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}

	// 清除文章相关缓存
	article.ClearArticleCache(ctx)
	_ = cache.DelByPrefix(ctx, "category:articles:")

	result.OkMsg("更新成功").Send(ctx)
}

func HandleCategoryArticleList(ctx *gin.Context) {
	list, err := SelectCategoryArticleList()
	if err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkData(list).Send(ctx)
}

func HandleAdminList(ctx *gin.Context) {
	page, size := util.GetPageParams(ctx)

	list, err := SelectAdminList(page, size)
	if err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkData(list).Send(ctx)
}
