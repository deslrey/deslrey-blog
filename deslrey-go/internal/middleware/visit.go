package middleware

import (
	"deslrey-go/internal/biz/visit"
	"deslrey-go/pkg/cache"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

var (
	visitKeyPrefix        = cache.KeyPrefix + "visit:"
	articleDetailPathExpr = regexp.MustCompile(`^/blog-api/web/article/(\d+)$`)
)

const (
	defaultVisitTTL = 10 * time.Minute
	articleVisitTTL = time.Minute
)

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

func shouldRecordVisit(ctx *gin.Context, ip string) bool {
	cacheCtx := ctx.Request.Context()
	key, ttl := buildVisitCacheKey(ip, ctx.Request.URL.Path)
	ok, err := cache.SetNX(cacheCtx, key, "1", ttl)
	if err != nil {
		return true
	}
	return ok
}

func buildVisitCacheKey(ip, path string) (string, time.Duration) {
	if articleID := extractArticleID(path); articleID != "" {
		return visitKeyPrefix + ip + ":article:" + articleID, articleVisitTTL
	}
	return visitKeyPrefix + ip, defaultVisitTTL
}

func extractArticleID(path string) string {
	matches := articleDetailPathExpr.FindStringSubmatch(path)
	if len(matches) == 2 {
		return matches[1]
	}
	return ""
}
