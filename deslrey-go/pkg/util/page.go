package util

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PageInfo[T any] struct {
	Page        int  `json:"page"`
	PageSize    int  `json:"pageSize"`
	Total       int  `json:"total"`
	List        []T  `json:"list"`
	HasNextPage bool `json:"hasNextPage"`
}

func Paginate[T any](count int64, list []T, page, size int) *PageInfo[T] {
	if page <= 0 {
		page = 1
	}
	if size <= 0 || size > 100 {
		size = 10
	}

	total := int(count)
	hasNext := page*size < total

	return &PageInfo[T]{
		Page:        page,
		PageSize:    size,
		Total:       total,
		List:        list,
		HasNextPage: hasNext,
	}
}

func PaginateScope(page, size int) func(*gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if page <= 0 {
			page = 1
		}
		if size <= 0 || size > 100 {
			size = 10
		}
		offset := (page - 1) * size
		return db.Offset(offset).Limit(size)
	}
}

func GetPageParams(ctx *gin.Context) (int, int) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(ctx.DefaultQuery("pageSize", "10"))
	if page <= 0 {
		page = 1
	}
	if size <= 0 || size > 100 {
		size = 10
	}
	return page, size
}
