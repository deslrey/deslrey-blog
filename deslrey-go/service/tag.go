package service

import (
	"deslrey-go/dao"
	"deslrey-go/logs"
	"deslrey-go/models"
	"deslrey-go/redis"
	"deslrey-go/results"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func TagCounts(ctx *gin.Context) {
	var list []models.TitleCount

	found, err := redis.Get(ctx, "tag:count", &list)
	if err != nil {
		logs.Logger.Warn("redis get tag:count failed", "err", err)
	}

	if found {
		results.OkData(list).Send(ctx)
		return
	}

	list, err = dao.SelectTagCounts()
	if err != nil {
		results.Fail().SendCode(http.StatusInternalServerError, ctx)
		return
	}

	if err := redis.SetForever(ctx, "tag:count", list); err != nil {
		logs.Logger.Warn("redis set tag:count failed", "err", err)
	}

	results.OkData(list).Send(ctx)
}

func TagArticles(ctx *gin.Context) {
	tagIdStr := ctx.Param("id")
	tagId, err := strconv.Atoi(tagIdStr)
	if err != nil {
		results.Fail().SendCode(http.StatusInternalServerError, ctx)
		return
	}
	list, err := dao.SelectTagArticles(tagId)
	if err != nil {
		results.Fail().SendCode(http.StatusInternalServerError, ctx)
	} else {
		results.OkData(list).Send(ctx)
	}
}
