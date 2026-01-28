package dao

import (
	"deslrey-go/models"
)

// SelectTagCounts 获取全部标签列表
func SelectTagCounts() ([]models.TitleCount, error) {
	var list []models.TitleCount

	err := postgresqlDB.
		Table("tag t").
		Select("t.id, t.title, COUNT(a.id) AS count").
		Joins("LEFT JOIN article_tag at ON t.id = at.tag_id").
		Joins("LEFT JOIN article a ON a.id = at.article_id AND a.exist = true").
		Group("t.id, t.title").
		Order("count DESC").
		Scan(&list).Error

	return list, err
}

// SelectTagArticles 根据标签ID获取对应的文章
func SelectTagArticles(tagId int) ([]models.ArticleVO, error) {
	var articles []models.ArticleVO

	err := postgresqlDB.
		Table("article a").
		Select(`
			a.id,
			a.title,
			a.des,
			a.sticky,
			a.edit,
			a.create_time,
			a.update_time,
			c.title AS category
		`).
		Joins("JOIN article_tag at ON at.article_id = a.id").
		Joins("LEFT JOIN category c ON c.id = a.category_id").
		Where("at.tag_id = ?", tagId).
		Where("a.exist = true").
		Order("a.create_time DESC").
		Scan(&articles).Error

	if err != nil {
		return nil, err
	}

	if len(articles) == 0 {
		return articles, nil
	}

	articleIDs := make([]int, 0, len(articles))
	for _, a := range articles {
		articleIDs = append(articleIDs, int(a.ID))
	}

	type tagRow struct {
		ArticleID int
		Tag       string
	}

	var tags []tagRow
	err = postgresqlDB.
		Table("article_tag at").
		Select("at.article_id, t.title AS tag").
		Joins("JOIN tag t ON t.id = at.tag_id").
		Where("at.article_id IN ?", articleIDs).
		Scan(&tags).Error
	if err != nil {
		return nil, err
	}

	tagMap := make(map[int][]string)
	for _, t := range tags {
		tagMap[t.ArticleID] = append(tagMap[t.ArticleID], t.Tag)
	}

	for i := range articles {
		articles[i].Tags = tagMap[int(articles[i].ID)]
	}

	return articles, nil
}
