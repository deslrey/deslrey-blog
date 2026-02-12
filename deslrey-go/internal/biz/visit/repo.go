package visit

import (
	"context"
	"deslrey-go/pkg/cache"
	"strconv"
	"time"

	"gorm.io/gorm"
)

var db *gorm.DB

var visitStatsKey = cache.KeyPrefix + "stats:visits"

func InitDB(database *gorm.DB) {
	db = database
}

func InsertVisitLog(log *VisitLog) error {
	log.VisitTime = time.Now()
	return db.Create(log).Error
}

func RefreshVisitStats() error {
	var count int64
	if err := db.Model(&VisitLog{}).Count(&count).Error; err != nil {
		return err
	}

	return cache.SetForever(context.Background(), visitStatsKey, count)
}

func SelectStats() (*VisitStats, error) {
	var count int64
	found, err := cache.Get(context.Background(), visitStatsKey, &count)
	if err != nil {
		return nil, err
	}

	if !found {
		if err := RefreshVisitStats(); err != nil {
			return nil, err
		}
		found, err = cache.Get(context.Background(), visitStatsKey, &count)
		if err != nil || !found {
			return nil, err
		}
	}

	return &VisitStats{TotalVisits: count}, nil
}

func IncrementVisitCount() error {
	ctx := context.Background()
	exists, err := cache.Exists(ctx, visitStatsKey)
	if err != nil {
		return err
	}

	if !exists {
		if err := RefreshVisitStats(); err != nil {
			return err
		}
	}

	_, err = cache.Incr(ctx, visitStatsKey)
	return err
}

func GetVisitCount() (int64, error) {
	var count int64
	found, err := cache.Get(context.Background(), visitStatsKey, &count)
	if err != nil || !found {
		return 0, err
	}
	return count, nil
}

func InitVisitStats() {
	ctx := context.Background()
	exists, err := cache.Exists(ctx, visitStatsKey)
	if err != nil {
		return
	}

	if !exists {
		var count int64
		if err := db.Model(&VisitLog{}).Count(&count).Error; err != nil {
			return
		}
		cache.SetForever(ctx, visitStatsKey, count)
	}
}

func GetVisitCountString() string {
	count, err := GetVisitCount()
	if err != nil {
		return "0"
	}
	return strconv.FormatInt(count, 10)
}
