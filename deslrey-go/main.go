package main

import (
	"deslrey-go/configs"
	"deslrey-go/dao"
	"deslrey-go/logs"
	"deslrey-go/redis"
	"deslrey-go/router"
	"deslrey-go/scheduler"
)

func main() {
	configs.Init()
	logs.Init()
	dao.Init()
	redis.Init()
	redis.InitCache()
	scheduler.Start()
	router.Start()
}
