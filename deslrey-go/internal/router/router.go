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

	api := engine.Group("/deslrey/api")

	userGroup := api.Group("/user")
	{
		userGroup.POST("/login", user.HandleLogin)
		userGroup.POST("/register", user.HandleRegister)
	}

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
	blacklist.Use(middleware.JWTAuth())

	err := engine.Run(":" + strconv.Itoa(config.Config.Port))
	if err != nil {
		logger.Logger.Fatal(err)
	}
}
