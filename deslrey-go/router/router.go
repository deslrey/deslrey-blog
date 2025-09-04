package router

import "github.com/gin-gonic/gin"

func Start() {
	engine := gin.Default()
	//	首页获取文章分页
	engine.POST("/")
}
