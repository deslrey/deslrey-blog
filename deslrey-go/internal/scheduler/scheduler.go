package scheduler

import (
	"context"
	"deslrey-go/internal/repository"
	"deslrey-go/pkg/cache"
	"deslrey-go/pkg/logger"
	"time"

	"github.com/robfig/cron/v3"
)

const cacheRefreshLockKey = "lock:cache:refresh"

func Start() {
	c := cron.New(cron.WithSeconds())

	_, err := c.AddFunc("0 0 0 * * *", func() {
		refreshCacheWithLock()
	})

	if err != nil {
		logger.Logger.Fatal("cron init failed", "err", err)
	}

	c.Start()
}

func refreshCacheWithLock() {
	ctx := context.Background()

	locked, err := cache.SetNX(
		ctx,
		cacheRefreshLockKey,
		time.Now().Unix(),
		time.Minute*10,
	)

	if err != nil {
		logger.Logger.Error("获取缓存刷新锁失败", "err", err)
		return
	}

	if !locked {
		return
	}

	logger.Logger.Info("获得缓存刷新锁，开始刷新缓存")

	start := time.Now()
	repository.InitCache()
	logger.Logger.Info(
		"缓存刷新完成",
		"cost", time.Since(start).String(),
	)
}
