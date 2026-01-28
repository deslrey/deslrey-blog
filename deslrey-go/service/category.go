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

func CategoryCounts(ctx *gin.Context) {

	var list []models.TitleCount

	fount, err := redis.Get(ctx, "category:count", &list)
	if err != nil {
		logs.Logger.Warn("redis get category:count failed,", "err", err)
	}

	if fount {
		results.OkData(list).Send(ctx)
		return
	}

	list, err = dao.SelectCategoryCounts()
	if err != nil {
		results.Fail().SendCode(http.StatusInternalServerError, ctx)
		return
	}

	if err := redis.SetForever(ctx, "category:count", list); err != nil {
		logs.Logger.Warn("redis set category:count faild", "err", err)
	}

	results.OkData(list).Send(ctx)
}

func CategoryArticles(ctx *gin.Context) {
	categoryIdStr := ctx.Param("id")
	categoryId, err := strconv.Atoi(categoryIdStr)
	if err != nil {
		results.Fail().SendCode(http.StatusInternalServerError, ctx)
		return
	}
	list, err := dao.SelectCategoryArticles(categoryId)
	if err != nil {
		results.Fail().SendCode(http.StatusInternalServerError, ctx)
	} else {
		results.OkData(list).Send(ctx)
	}
}
