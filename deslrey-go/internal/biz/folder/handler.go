package folder

import (
	"deslrey-go/pkg/result"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func HandleFolderNameList(c *gin.Context) {
	folders, err := SelectFolderNameList()
	if err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, c)
		return
	}
	result.OkData(folders).Send(c)
}

func HandleAdminList(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(ctx.DefaultQuery("pageSize", "10"))

	folders, err := SelectAdminList(page, size)
	if err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkData(folders).Send(ctx)
}

func HandleAddFolder(ctx *gin.Context) {
	var req AddFolderRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		result.FailMsg("请求参数错误").SendCode(http.StatusBadRequest, ctx)
		return
	}

	if err := InsertFolder(req.FolderName); err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkMsg("添加成功").Send(ctx)
}

func HandleUpdateFolder(ctx *gin.Context) {
	var req UpdateFolderRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		result.FailMsg("请求参数错误").SendCode(http.StatusBadRequest, ctx)
		return
	}

	if err := UpdateFolder(req.ID, req.FolderName); err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkMsg("更新成功").Send(ctx)
}
