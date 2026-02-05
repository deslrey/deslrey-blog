package main

import (
	"deslrey-go/internal/config"
	"deslrey-go/internal/repository"
	"deslrey-go/internal/router"
	"deslrey-go/internal/scheduler"
	"deslrey-go/pkg/cache"
	"deslrey-go/pkg/logger"
)

func main() {
	config.Init()
	logger.Init()
	cache.Init()
	repository.Init()
	scheduler.Start()
	router.Start()
}
