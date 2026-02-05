package middleware

import (
	"deslrey-go/pkg/cache"
	"deslrey-go/pkg/result"
	"deslrey-go/pkg/util"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

const TokenExpiration = 30 * time.Minute

func JWTAuth() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			result.FailCodeMsg(http.StatusUnauthorized, "未登录").SendCode(http.StatusUnauthorized, ctx)
			ctx.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			result.FailMsg("token格式错误").SendCode(http.StatusUnauthorized, ctx)
			ctx.Abort()
			return
		}

		tokenString := parts[1]
		claims, err := util.ParseToken(tokenString)
		if err != nil {
			result.FailMsg("token无效或已过期").SendCode(http.StatusUnauthorized, ctx)
			ctx.Abort()
			return
		}

		tokenKey := util.GenerateTokenKey(claims.UserID)
		var cachedToken string
		found, err := cache.Get(ctx.Request.Context(), tokenKey, &cachedToken)
		if err != nil || !found || cachedToken != tokenString {
			result.FailMsg("token无效或已过期").SendCode(http.StatusUnauthorized, ctx)
			ctx.Abort()
			return
		}

		cache.Expire(ctx.Request.Context(), tokenKey, TokenExpiration)

		ctx.Set("userId", claims.UserID)
		ctx.Set("userName", claims.UserName)
		ctx.Next()
	}
}
