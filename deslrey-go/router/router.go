package router

import (
	"deslrey-go/configs"
	"deslrey-go/logs"
	"deslrey-go/middleware"
	"deslrey-go/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

func Start() {
	engine := gin.Default()

	//	使用中间件
	engine.Use(middleware.HandleEndpointLantency())
	engine.Use(middleware.Cors())

	// 所有接口统一前缀 /deslrey/api
	api := engine.Group("/deslrey/api")

	//	文章组
	article := api.Group("/article")
	{
		article.GET("/list", service.ArticleList)
		article.GET("/:articleId", service.ArticleDetail)
	}
	//	标签组
	tag := api.Group("/tag")
	{
		tag.GET("/count", service.TagCounts)
		tag.GET("/:id", service.TagArticles)
	}

	//	分类组
	category := api.Group("/category")
	{
		category.GET("count", service.CategoryCounts)
		category.GET("/:id", service.CategoryArticles)

	}

	err := engine.Run(":" + strconv.Itoa(configs.Config.Port))
	if err != nil {
		logs.Logger.Fatal(err)
	}
}
