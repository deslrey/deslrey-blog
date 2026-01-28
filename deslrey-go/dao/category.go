package dao

import "deslrey-go/models"

// SelectCategoryCounts	获取全部分类列表
func SelectCategoryCounts() ([]models.TitleCount, error) {
	var list []models.TitleCount

	err := postgresqlDB.
		Table("category c").
		Select("c.id, c.title, COUNT(a.id) AS count").
		Joins(`LEFT JOIN article a ON a.category_id = c.id AND a.exist = true`).
		Group("c.id, c.title").
		Order("count DESC").
		Scan(&list).Error

	return list, err
}

// SelectCategoryArticles	根据分类ID获取对应的文章
func SelectCategoryArticles(categoryId int) ([]models.ArticleVO, error) {
	var articles []models.ArticleVO

	err := postgresqlDB.
		Table("article a").
		Select(`
		a.id,
		a.title,
		a.des,
		a.edit,
		a.create_time,
		a.update_time,
		c.title AS category
		`).
		Joins("JOIN article_tag at ON at.article_id = a.id").
		Joins("LEFT JOIN category c ON c.id = a.category_id").
		Where("a.category_id = ?", categoryId).
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
