package visit

import (
	"deslrey-go/pkg/logger"
	"deslrey-go/pkg/result"
	"deslrey-go/pkg/util"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func RecordVisitLog(ctx *gin.Context) {
	ip := GetClientIP(ctx)
	userAgent := ctx.GetHeader("User-Agent")
	referer := ctx.GetHeader("Referer")
	path := ctx.Request.URL.Path

	if !EnqueueVisitLog(VisitPayload{
		IP:        ip,
		UserAgent: userAgent,
		Referer:   referer,
		Path:      path,
	}) {
		logger.Logger.Warn("visit queue full, drop log", "path", path, "ip", ip)
	}
}

func HandleGetStats(ctx *gin.Context) {
	stats, err := SelectStats()
	if err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkData(stats).Send(ctx)
}

func HandleGetWeeklyStats(ctx *gin.Context) {
	stats, err := SelectWeeklyStats()
	if err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkData(stats).Send(ctx)
}

func HandleGetLogs(ctx *gin.Context) {
	page, size := util.GetPageParams(ctx)
	filter := VisitLogFilter{
		Keyword: strings.TrimSpace(ctx.Query("keyword")),
		Device:  strings.TrimSpace(ctx.Query("device")),
	}

	const dateLayout = "2006-01-02"
	if start := strings.TrimSpace(ctx.Query("startDate")); start != "" {
		startTime, err := time.ParseInLocation(dateLayout, start, time.Local)
		if err != nil {
			result.FailMsg("开始日期格式异常").SendCode(http.StatusBadRequest, ctx)
			return
		}
		filter.Start = &startTime
	}

	if end := strings.TrimSpace(ctx.Query("endDate")); end != "" {
		endTime, err := time.ParseInLocation(dateLayout, end, time.Local)
		if err != nil {
			result.FailMsg("结束日期格式异常").SendCode(http.StatusBadRequest, ctx)
			return
		}
		endTime = endTime.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
		filter.End = &endTime
	}

	pageInfo, err := SelectVisitLogs(page, size, filter)
	if err != nil {
		result.FailMsg(err.Error()).SendCode(http.StatusInternalServerError, ctx)
		return
	}
	result.OkData(pageInfo).Send(ctx)
}
