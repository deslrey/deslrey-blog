package draft

import (
	"deslrey-go/pkg/result"
	"deslrey-go/pkg/util"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func HandleAdminList(ctx *gin.Context) {
	page, size := util.GetPageParams(ctx)

	drafts, err := SelectAdminList(page, size)
	if err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkData(drafts).Send(ctx)
}

func HandleDetail(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		result.FailMsg("无效的草稿ID").SendCode(http.StatusBadRequest, ctx)
		return
	}

	draft, err := SelectById(id)
	if err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkData(draft).Send(ctx)
}

func HandleAddDraft(ctx *gin.Context) {
	var req AddDraftRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		result.FailMsg("请求参数错误").SendCode(http.StatusBadRequest, ctx)
		return
	}

	if err := InsertDraft(&req); err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkMsg("添加成功").Send(ctx)
}

func HandleUpdateDraft(ctx *gin.Context) {
	var req UpdateDraftRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		result.FailMsg("请求参数错误").SendCode(http.StatusBadRequest, ctx)
		return
	}

	if err := UpdateDraft(&req); err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkMsg("更新成功").Send(ctx)
}

func HandleDeleteDraft(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		result.FailMsg("无效的草稿ID").SendCode(http.StatusBadRequest, ctx)
		return
	}

	if err := DeleteDraft(id); err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkMsg("删除成功").Send(ctx)
}
