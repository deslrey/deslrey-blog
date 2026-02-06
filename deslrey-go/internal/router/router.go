package router

import (
	"deslrey-go/internal/biz/article"
	"deslrey-go/internal/biz/category"
	"deslrey-go/internal/biz/tag"
	"deslrey-go/internal/biz/user"
	"deslrey-go/internal/config"
	"deslrey-go/internal/middleware"
	"deslrey-go/pkg/logger"
	"strconv"

	"github.com/gin-gonic/gin"
)

func Start() {
	engine := gin.Default()

	engine.Use(middleware.HandleEndpointLantency())
	engine.Use(middleware.Cors())

	staticPath := config.Config.Custom.StaticSourcePath

	staticGroup := engine.Group(config.Config.Custom.StaticUrl)
	{
		// 设置强缓存
		staticGroup.Use(func(c *gin.Context) {
			c.Header("Cache-Control", "public, max-age=31536000, immutable")
			c.Next()
		})
		// 映射物理路径到 URL
		staticGroup.Static("", staticPath)
	}

	api := engine.Group("/blog-api")

	whitelistApi := api.Group("/white")

	articleWhite := whitelistApi.Group("/article")
	{
		articleWhite.GET("/list", article.HandleList)
		articleWhite.GET("/:articleId", article.HandleDetail)
	}

	tagWhite := whitelistApi.Group("/tag")
	{
		tagWhite.GET("/count", tag.HandleCounts)
		tagWhite.GET("/:id", tag.HandleArticles)
	}

	categoryWhite := whitelistApi.Group("/category")
	{
		categoryWhite.GET("count", category.HandleCounts)
		categoryWhite.GET("/:id", category.HandleArticles)
	}

	blacklist := api.Group("/black")

	userAuth := blacklist.Group("/user")
	{
		userAuth.POST("/login", user.HandleLogin)
		userAuth.POST("/register", user.HandleRegister)
	}

	protected := blacklist.Group("/")
	protected.Use(middleware.JWTAuth())

	err := engine.Run(":" + strconv.Itoa(config.Config.Port))
	if err != nil {
		logger.Logger.Fatal(err)
	}
}
