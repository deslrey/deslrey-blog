package visit

import (
	"deslrey-go/pkg/result"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RecordVisitLog(ctx *gin.Context) {
	go func() {
		ip := GetClientIP(ctx)
		userAgent := ctx.GetHeader("User-Agent")
		referer := ctx.GetHeader("Referer")
		location := QueryIPLocation(ip)
		device := GetDeviceType(userAgent)
		path := ctx.Request.URL.Path

		log := &VisitLog{
			IP:        ip,
			Location:  location,
			UserAgent: userAgent,
			Referer:   referer,
			Path:      path,
			Device:    device,
		}

		_ = InsertVisitLog(log)
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
