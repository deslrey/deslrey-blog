package category

import (
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

	found, err := cache.Get(ctx, "category:count", &list)
	if err != nil {
		logger.Logger.Warn("redis get category:count failed,", "err", err)
	}

	if found {
		result.OkData(list).Send(ctx)
		return
	}

	list, err = SelectCounts()
	if err != nil {
		result.Fail().SendCode(http.StatusInternalServerError, ctx)
		return
	}

	if err := cache.SetForever(ctx, "category:count", list); err != nil {
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

	pageInfo, err := SelectArticles(categoryId, page, size)
	if err != nil {
		result.Fail().SendCode(http.StatusInternalServerError, ctx)
	} else {
		result.OkData(pageInfo).Send(ctx)
	}
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
