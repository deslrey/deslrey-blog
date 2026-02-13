package article

import (
	"deslrey-go/pkg/result"
	"deslrey-go/pkg/util"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func HandleWebList(ctx *gin.Context) {
	page, size := util.GetPageParams(ctx)

	pageInfo, err := SelectWebList(page, size)
	if err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkData(pageInfo).Send(ctx)
}

func HandleAdminList(ctx *gin.Context) {
	page, size := util.GetPageParams(ctx)

	pageInfo, err := SelectAdminList(page, size)
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

func HandleViewHot(ctx *gin.Context) {
	viewsHostList, err := SelectViewHot()
	if err != nil {
		result.Fail().SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkData(viewsHostList).Send(ctx)
}

func HandleEditArticle(ctx *gin.Context) {
	articleIdStr := ctx.Param("articleId")
	articleId, err := strconv.Atoi(articleIdStr)
	if err != nil || articleId <= 0 {
		result.FailMsg("无效的文章ID").SendCode(http.StatusBadRequest, ctx)
		return
	}

	articleEditVO, err := SelectEditArticle(articleId)
	if err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkData(articleEditVO).Send(ctx)
}

func HandleAddArticle(ctx *gin.Context) {
	var req AddArticleRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		result.FailMsg("请求参数错误: "+err.Error()).SendCode(http.StatusBadRequest, ctx)
		return
	}

	if err := InsertOrUpdateArticle(&req); err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkMsg("保存成功").Send(ctx)
}

func HandleEditExist(ctx *gin.Context) {
	var req EditExistRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		result.FailMsg("请求参数错误").SendCode(http.StatusBadRequest, ctx)
		return
	}

	if err := UpdateArticleExist(req.ID, req.Exist); err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkMsg("操作成功").Send(ctx)
}

func HandleArticleCounts(ctx *gin.Context) {
	counts, err := SelectArticleCountsByMonth()
	if err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkData(counts).Send(ctx)
}
