package visit

import (
	"deslrey-go/pkg/result"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RecordVisitLog(ctx *gin.Context) {
	ip := GetClientIP(ctx)
	userAgent := ctx.GetHeader("User-Agent")
	referer := ctx.GetHeader("Referer")
	path := ctx.Request.URL.Path

	go func() {
		location := QueryIPLocation(ip)
		device := GetDeviceType(userAgent)

		log := &VisitLog{
			IP:        ip,
			Location:  location,
			UserAgent: userAgent,
			Referer:   referer,
			Path:      path,
			Device:    device,
		}

		if err := InsertVisitLog(log); err != nil {
			fmt.Printf("RecordVisitLog background error: %v\n", err)
		}
	}()
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
