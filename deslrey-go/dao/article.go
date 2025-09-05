package dao

import (
	"deslrey-go/db"
	"deslrey-go/model"
)

func GetAll() ([]model.Article, error) {
	var articleList []model.Article
	result := db.GetDB().Find(&articleList)
	return articleList, result.Error
}
