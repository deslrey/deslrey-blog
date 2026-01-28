package dao

import (
	"deslrey-go/models"
	"errors"
)

// SelectArticleList 获取文章分页列表
func SelectArticleList(page, size int) ([]models.ArticleVO, int, error) {
	offset := (page - 1) * size
	var list []models.ArticleVO
	var count int64

	//	统计总数
	if err := postgresqlDB.Model(&models.Article{}).
		Where("exist = ?", true).
		Count(&count).Error; err != nil {
		return nil, 0, err
	}

	//	查询文章 + 分类
	err := postgresqlDB.Model(&models.Article{}).
		Select("article.id, article.title, article.des, article.sticky, article.edit, article.create_time, article.update_time, category.title AS category").
		Joins("LEFT JOIN category ON article.category_id = category.id").
		Where("article.exist = ?", true).
		Limit(size).
		Offset(offset).
		Order("article.create_time DESC").
		Scan(&list).Error
	if err != nil {
		return nil, 0, err
	}

	//	查询每篇文章的标签
	for i := range list {
		var tags []string
		err := postgresqlDB.Model(&models.Tag{}).
			Select("tag.title").
			Joins("JOIN article_tag ON article_tag.tag_id = tag.id").
			Where("article_tag.article_id = ?", list[i].ID).
			Pluck("title", &tags).Error
		if err != nil {
			return nil, 0, err
		}
		list[i].Tags = tags
	}

	return list, int(count), nil
}

// SelectArticleDetail	查询文章的详细信息
func SelectArticleDetail(articleId int) (models.Article, error) {
	var article models.Article

	if articleId <= 0 {
		return article, errors.New("invalid articleId")
	}

	err := postgresqlDB.
		Model(&models.Article{}).
		Select("id, title, content, word_count, views, read_time, des, sticky, edit").
		Where("id = ? AND exist = ?", articleId, true).
		First(&article).Error

	if err != nil {
		return article, err
	}

	return article, nil
}
