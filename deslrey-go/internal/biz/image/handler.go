package image

import (
	"deslrey-go/internal/config"
	"deslrey-go/pkg/result"
	"deslrey-go/pkg/util"
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func HandleAdminList(ctx *gin.Context) {
	page, size := util.GetPageParams(ctx)

	images, err := SelectAdminList(page, size)
	if err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkData(images).Send(ctx)
}

func HandleUploadImage(ctx *gin.Context) {
	folderId, err := strconv.Atoi(ctx.PostForm("folderId"))
	if err != nil || folderId <= 0 {
		result.FailMsg("无效的文件夹ID").SendCode(http.StatusBadRequest, ctx)
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		result.FailMsg("请选择上传的图片").SendCode(http.StatusBadRequest, ctx)
		return
	}

	folder, err := SelectFolderById(folderId)
	if err != nil {
		result.FailMsg("文件夹不存在").SendCode(http.StatusBadRequest, ctx)
		return
	}

	originalFileName := file.Filename
	ext := filepath.Ext(originalFileName)
	generatedNewImageName := strconv.FormatInt(time.Now().UnixNano(), 10) + ext

	savePath := filepath.Join(config.Config.Custom.StaticSourcePath, folder.Path, generatedNewImageName)
	if err := ctx.SaveUploadedFile(file, savePath); err != nil {
		result.FailMsg("保存图片失败").SendCode(http.StatusInternalServerError, ctx)
		return
	}

	image := Image{
		FolderID:   folderId,
		ImageName:  generatedNewImageName,
		OriginName: originalFileName,
		Path:       folder.Path,
		Url:        "/" + generatedNewImageName,
		Size:       int(file.Size),
		CreateTime: time.Now(),
	}

	if err := InsertImage(&image); err != nil {
		result.FailMsg("保存图片信息失败").SendCode(http.StatusInternalServerError, ctx)
		return
	}

	result.OkData(image.Path + image.Url).Send(ctx)
}

func HandleObscureFolderName(ctx *gin.Context) {
	folderName := ctx.Query("folderName")
	if folderName == "" {
		result.OkData([]ImageItem{}).Send(ctx)
		return
	}

	images, err := SelectByFolderName(folderName)
	if err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkData(images).Send(ctx)
}

func HandleDeleteImage(ctx *gin.Context) {
	imageIdStr := ctx.Param("imageId")
	imageId, err := strconv.Atoi(imageIdStr)
	if err != nil || imageId <= 0 {
		result.FailMsg("无效的图片ID").SendCode(http.StatusBadRequest, ctx)
		return
	}

	if err := DeleteImage(imageId); err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkMsg("删除成功").Send(ctx)
}
