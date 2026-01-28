package middleware

import (
	"deslrey-go/configs"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", configs.Config.DomainName) // 允许的域名
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Jwt")
		c.Header("Access-Control-Expose-Headers", "X-Jwt")
		c.Header("Access-Control-Allow-Credentials", "true") // 允许携带 cookie

		// 预检请求
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	}
}
