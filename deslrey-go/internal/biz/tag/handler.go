package tag

import (
	"deslrey-go/pkg/cache"
	"deslrey-go/pkg/logger"
	"deslrey-go/pkg/result"
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
	list, err := SelectArticles(tagId)
	if err != nil {
		result.Fail().SendCode(http.StatusInternalServerError, ctx)
	} else {
		result.OkData(list).Send(ctx)
	}
}
