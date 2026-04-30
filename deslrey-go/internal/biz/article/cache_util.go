package article

import (
	"context"
	"deslrey-go/pkg/cache"
	"fmt"
)

const (
	CacheKeyWebListPrefix = "article:web_list:"
	CacheKeyDetailPrefix  = "article:detail:"
	CacheKeyHot           = "article:hot"
	CacheKeyMonthCounts   = "article:month_counts"
)

// ClearArticleCache 清除所有文章相关的前台缓存
func ClearArticleCache(ctx context.Context) {
	// 删除列表和详情 (DelByPrefix 内部会自动加上 KeyPrefix)
	_ = cache.DelByPrefix(ctx, CacheKeyWebListPrefix)
	_ = cache.DelByPrefix(ctx, CacheKeyDetailPrefix)

	// 删除排行榜和月份统计
	_ = cache.Del(ctx, GetHotKey(), GetMonthCountsKey())

	// 清除分类和标签的文章列表缓存 (DelByPrefix 内部会自动加上 KeyPrefix)
	_ = cache.DelByPrefix(ctx, "category:articles:")
	_ = cache.DelByPrefix(ctx, "tag:articles:")

	// 清除分类和标签统计缓存
	_ = cache.Del(ctx, GetCategoryCountKey(), GetTagCountKey())
}

func GetWebListKey(page, size int) string {
	return fmt.Sprintf("%s%sp%d:s%d", cache.KeyPrefix, CacheKeyWebListPrefix, page, size)
}

func GetDetailKey(id int) string {
	return fmt.Sprintf("%s%s%d", cache.KeyPrefix, CacheKeyDetailPrefix, id)
}

func GetHotKey() string {
	return cache.KeyPrefix + CacheKeyHot
}

func GetMonthCountsKey() string {
	return cache.KeyPrefix + CacheKeyMonthCounts
}

func GetCategoryCountKey() string {
	return cache.KeyPrefix + "category:count"
}

func GetTagCountKey() string {
	return cache.KeyPrefix + "tag:count"
}

func GetCategoryArticlesKey(categoryID, page, size int) string {
	return fmt.Sprintf("%scategory:articles:%d:%d:%d", cache.KeyPrefix, categoryID, page, size)
}

func GetTagArticlesKey(tagID, page, size int) string {
	return fmt.Sprintf("%stag:articles:%d:%d:%d", cache.KeyPrefix, tagID, page, size)
}
