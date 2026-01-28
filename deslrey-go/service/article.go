package service

import (
	"deslrey-go/dao"
	"deslrey-go/models"
	"deslrey-go/results"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ArticleList(ctx *gin.Context) {
	pageStr := ctx.DefaultQuery("page", "1")
	sizeStr := ctx.DefaultQuery("pageSize", "10")

	page, _ := strconv.Atoi(pageStr)
	size, _ := strconv.Atoi(sizeStr)

	if page < 1 {
		page = 1
	}

	if size < 1 {
		size = 10
	}

	list, total, err := dao.SelectArticleList(page, size)
	if err != nil {
		results.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}

	totalPages := (total + size - 1) / size

	resp := models.PageInfo[models.ArticleVO]{
		Page:        page,
		PageSize:    size,
		List:        list,
		Total:       int64(total),
		HasNextPage: page < totalPages,
	}

	results.OkData(resp).Send(ctx)
}

func ArticleDetail(ctx *gin.Context) {
	articleIdStr := ctx.Param("articleId")
	articleId, err := strconv.Atoi(articleIdStr)
	if err != nil || articleId <= 0 {
		results.Fail().SendCode(http.StatusBadRequest, ctx)
		return
	}

	article, err := dao.SelectArticleDetail(articleId)
	if err != nil {
		results.Fail().SendCode(http.StatusInternalServerError, ctx)
		return
	}

	results.OkData(article).Send(ctx)
}
