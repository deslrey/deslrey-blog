package tag

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

	found, err := cache.Get(ctx, "tag:count", &list)
	if err != nil {
		logger.Logger.Warn("redis get tag:count failed", "err", err)
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

	if err := cache.SetForever(ctx, "tag:count", list); err != nil {
		logger.Logger.Warn("redis set tag:count failed", "err", err)
	}

	result.OkData(list).Send(ctx)
}

func HandleArticles(ctx *gin.Context) {
	tagIdStr := ctx.Param("id")
	tagId, err := strconv.Atoi(tagIdStr)
	if err != nil {
		result.Fail().SendCode(http.StatusInternalServerError, ctx)
		return
	}

	page, size := util.GetPageParams(ctx)

	pageInfo, err := SelectArticles(tagId, page, size)
	if err != nil {
		result.Fail().SendCode(http.StatusInternalServerError, ctx)
	} else {
		result.OkData(pageInfo).Send(ctx)
	}
}

func HandleAddTag(ctx *gin.Context) {
	var req AddTagRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		result.FailMsg("请求参数错误").SendCode(http.StatusBadRequest, ctx)
		return
	}

	if err := InsertTag(req.Title); err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkMsg("添加成功").Send(ctx)
}

func HandleUpdateTagTitle(ctx *gin.Context) {
	var req UpdateTagRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		result.FailMsg("请求参数错误").SendCode(http.StatusBadRequest, ctx)
		return
	}

	if err := UpdateTagTitle(req.ID, req.Title); err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkMsg("更新成功").Send(ctx)
}

func HandleTagNameList(ctx *gin.Context) {
	list, err := SelectTagNameList()
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
