package middleware

import (
	"context"
	"deslrey-go/internal/biz/visit"
	"deslrey-go/pkg/cache"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

var visitKeyPrefix = cache.KeyPrefix + "visit:"

func VisitLog() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		path := ctx.Request.URL.Path

		if isExcludedPath(path) {
			ctx.Next()
			return
		}

		ip := visit.GetClientIP(ctx)
		if shouldRecordVisit(ctx, ip) {
			visit.RecordVisitLog(ctx)
		}
		ctx.Next()
	}
}

func isExcludedPath(path string) bool {
	// 静态资源前缀
	if strings.HasPrefix(path, "/static") ||
		strings.HasPrefix(path, "/favicon") ||
		strings.HasPrefix(path, "/assets") ||
		strings.Contains(path, "/carousel/") {
		return true
	}

	// 常见的静态文件扩展名
	if strings.Contains(path, ".js") ||
		strings.Contains(path, ".css") ||
		strings.Contains(path, ".png") ||
		strings.Contains(path, ".jpg") ||
		strings.Contains(path, ".jpeg") ||
		strings.Contains(path, ".gif") ||
		strings.Contains(path, ".ico") ||
		strings.Contains(path, ".svg") {
		return true
	}

	// 统计接口本身不记录访问
	if strings.HasSuffix(path, "/visit/stats") {
		return true
	}

	return false
}

func shouldRecordVisit(ctx context.Context, ip string) bool {
	key := visitKeyPrefix + ip
	ok, err := cache.SetNX(ctx, key, "1", 10*time.Minute)
	if err != nil {
		return true
	}
	return ok
}
