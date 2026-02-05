package article

import (
	"deslrey-go/pkg/result"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func HandleList(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(ctx.DefaultQuery("pageSize", "10"))

	pageInfo, err := SelectList(page, size)
	if err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkData(pageInfo).Send(ctx)
}

func HandleDetail(ctx *gin.Context) {
	articleIdStr := ctx.Param("articleId")
	articleId, err := strconv.Atoi(articleIdStr)
	if err != nil || articleId <= 0 {
		result.Fail().SendCode(http.StatusBadRequest, ctx)
		return
	}

	article, err := SelectDetail(articleId)
	if err != nil {
		result.Fail().SendCode(http.StatusInternalServerError, ctx)
		return
	}

	result.OkData(article).Send(ctx)
}
