package scheduler

import (
	"context"
	"deslrey-go/logs"
	"deslrey-go/redis"
	"time"

	"github.com/robfig/cron/v3"
)

const cacheRefreshLockKey = "lock:cache:refresh"

func Start() {
	c := cron.New(cron.WithSeconds())

	// 每天凌晨 00:00
	_, err := c.AddFunc("0 0 0 * * *", func() {
		refreshCacheWithLock()
	})

	if err != nil {
		logs.Logger.Fatal("cron init failed", "err", err)
	}

	c.Start()
}

func refreshCacheWithLock() {
	ctx := context.Background()

	locked, err := redis.SetNX(
		ctx,
		cacheRefreshLockKey,
		time.Now().Unix(),
		time.Minute*10,
	)

	if err != nil {
		logs.Logger.Error("获取缓存刷新锁失败", "err", err)
		return
	}

	if !locked {
		return
	}

	logs.Logger.Info("获得缓存刷新锁，开始刷新缓存")

	start := time.Now()
	redis.InitCache()
	logs.Logger.Info(
		"缓存刷新完成",
		"cost", time.Since(start).String(),
	)
}
