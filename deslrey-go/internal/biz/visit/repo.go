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

func SelectWeeklyStats() ([]map[string]interface{}, error) {
	var stats []map[string]interface{}

	// 获取近7天的日期
	endDate := time.Now()
	startDate := endDate.AddDate(0, 0, -6)

	// 按天分组查询访问量
	rows, err := db.Model(&VisitLog{}).
		Select("TO_CHAR(visit_time, 'YYYY-MM-DD') as date, COUNT(*) as count").
		Where("visit_time >= ? AND visit_time <= ?", startDate, endDate).
		Group("TO_CHAR(visit_time, 'YYYY-MM-DD')").
		Order("date").
		Rows()

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// 构建日期到访问量的映射
	dateCountMap := make(map[string]int64)
	for rows.Next() {
		var date string
		var count int64
		if err := rows.Scan(&date, &count); err != nil {
			return nil, err
		}
		dateCountMap[date] = count
	}

	// 填充缺失的日期，确保连续7天的数据
	for i := 0; i < 7; i++ {
		date := startDate.AddDate(0, 0, i).Format("2006-01-02")
		count, ok := dateCountMap[date]
		if !ok {
			count = 0
		}

		stats = append(stats, map[string]interface{}{
			"date":  date,
			"count": count,
		})
	}

	return stats, nil
}
