package router

import (
	"deslrey-go/internal/biz/article"
	"deslrey-go/internal/biz/carousel"
	"deslrey-go/internal/biz/category"
	"deslrey-go/internal/biz/draft"
	"deslrey-go/internal/biz/folder"
	"deslrey-go/internal/biz/image"
	"deslrey-go/internal/biz/tag"
	"deslrey-go/internal/biz/user"
	"deslrey-go/internal/biz/visit"
	"deslrey-go/internal/config"
	"deslrey-go/internal/middleware"
	"deslrey-go/pkg/logger"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func Start() {
	engine := gin.Default()

	// 全局中间件
	engine.Use(middleware.HandleEndpointLatency())
	engine.Use(middleware.Cors())
	engine.Use(middleware.VisitLog())

	staticPath := config.Config.Custom.StaticSourcePath
	staticGroup := engine.Group(config.Config.Custom.StaticUrl)
	{
		staticGroup.Use(func(c *gin.Context) {
			c.Header("Cache-Control", "public, max-age=31536000, immutable")
			c.Next()
		})
		staticGroup.Static("", staticPath)
	}

	// API 根路径
	api := engine.Group("/blog-api")

	web := api.Group("/web")
	{

		// 轮播图相关
		carouselGroup := web.Group("/carousel")
		{
			carouselGroup.GET("/sex", carousel.HandleSexImage)
			carouselGroup.GET("/scenery", carousel.HandleSceneryImage)
		}

		// 文章相关
		articleWeb := web.Group("/article")
		{
			articleWeb.GET("/list", article.HandleWebList)      // 前台列表
			articleWeb.GET("/:articleId", article.HandleDetail) // 详情
		}

		// 标签相关
		tagWeb := web.Group("/tag")
		{
			tagWeb.GET("/count", tag.HandleCounts)
			tagWeb.GET("/:id", tag.HandleArticles)
		}

		// 分类相关
		categoryWeb := web.Group("/category")
		{
			categoryWeb.GET("/count", category.HandleCounts)
			categoryWeb.GET("/:id", category.HandleArticles)
		}

		// 访问统计
		visitWeb := web.Group("/visit")
		{
			visitWeb.GET("/stats", visit.HandleGetStats)
		}
	}

	admin := api.Group("/admin")
	auth := admin.Group("/auth")
	{
		auth.POST("/login", user.HandleLogin)
		auth.POST("/register", user.HandleRegister)
	}

	protected := admin.Group("/")
	protected.Use(middleware.JWTAuth())
	{
		articleAdmin := protected.Group("/article")
		{
			articleAdmin.GET("/list", article.HandleAdminList)
			articleAdmin.GET("/viewHot", article.HandleViewHot)
			articleAdmin.GET("/editArticle/:articleId", article.HandleEditArticle)
			articleAdmin.POST("/addArticle", article.HandleAddArticle)
			articleAdmin.POST("/editExist", article.HandleEditExist)
			articleAdmin.GET("/counts", article.HandleArticleCounts)
		}

		tagAdmin := protected.Group("/tag")
		{
			tagAdmin.GET("/tagList", tag.HandleAdminList)
			tagAdmin.POST("/addTag", tag.HandleAddTag)
			tagAdmin.POST("/updateTagTitle", tag.HandleUpdateTagTitle)
			tagAdmin.GET("/tagNameList", tag.HandleTagNameList)
		}

		categoryAdmin := protected.Group("/category")
		{
			categoryAdmin.GET("/categoryList", category.HandleAdminList)
			categoryAdmin.POST("/addCategory", category.HandleAddCategory)
			categoryAdmin.POST("/updateCategoryTitle", category.HandleUpdateCategoryTitle)
			categoryAdmin.GET("/categoryArticleList", category.HandleCategoryArticleList)
		}

		folderAdmin := protected.Group("/folder")
		{
			folderAdmin.GET("/list", folder.HandleAdminList)
			folderAdmin.GET("/folderNameList", folder.HandleFolderNameList)
			folderAdmin.POST("/addFolder", folder.HandleAddFolder)
			folderAdmin.POST("/updateFolder", folder.HandleUpdateFolder)
		}

		imageAdmin := protected.Group("/image")
		{
			imageAdmin.GET("/list", image.HandleAdminList)
			imageAdmin.POST("/uploadImage", image.HandleUploadImage)
			imageAdmin.GET("/obscure", image.HandleObscureFolderName)
			imageAdmin.DELETE("/deleteImage/:imageId", image.HandleDeleteImage)
		}

		draftAdmin := protected.Group("/draft")
		{
			draftAdmin.GET("/draftList", draft.HandleAdminList)
			draftAdmin.GET("/detail/:id", draft.HandleDetail)
			draftAdmin.POST("/addDraft", draft.HandleAddDraft)
			draftAdmin.POST("/updateDraft", draft.HandleUpdateDraft)
			draftAdmin.DELETE("/deleteDraft/:id", draft.HandleDeleteDraft)
		}

		userAdmin := protected.Group("/user")
		{
			userAdmin.POST("/updateUserName", user.HandleUpdateUserName)
			userAdmin.POST("/updatePassword", user.HandleUpdatePassword)
		}

		visitAdmin := protected.Group("/visit")
		{
			visitAdmin.GET("/stats", visit.HandleGetStats)
			visitAdmin.GET("/weekly", visit.HandleGetWeeklyStats)
			visitAdmin.GET("/logs", visit.HandleGetLogs)
		}
	}

	engine.NoRoute(func(ctx *gin.Context) {
		path := ctx.Request.URL.Path
		if strings.HasPrefix(path, "/blog-api/admin") &&
			!strings.HasPrefix(path, "/blog-api/admin/auth") {
			middleware.JWTAuth()(ctx)
			if ctx.IsAborted() {
				return
			}
		}
		ctx.JSON(404, gin.H{"code": 404, "message": "接口不存在"})
	})

	// 启动服务
	err := engine.Run(":" + strconv.Itoa(config.Config.Port))
	if err != nil {
		logger.Logger.Fatal(err)
	}
}
