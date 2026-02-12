package category

import (
	"deslrey-go/pkg/util"
	"errors"

	"gorm.io/gorm"
)

var db *gorm.DB

func InitDB(database *gorm.DB) {
	db = database
}

func SelectCounts() ([]TitleCount, error) {
	var list []TitleCount

	err := db.
		Table("category c").
		Select("c.id, c.title, COUNT(a.id) AS count").
		Joins(`LEFT JOIN article a ON a.category_id = c.id AND a.exist = true`).
		Group("c.id, c.title").
		Order("count DESC").
		Scan(&list).Error

	return list, err
}

func SelectArticles(categoryId, page, size int) (*util.PageInfo[ArticleListItem], error) {
	baseQuery := db.
		Table("article a").
		Where("a.category_id = ?", categoryId).
		Where("a.exist = true")

	var count int64
	if err := baseQuery.Count(&count).Error; err != nil {
		return nil, err
	}

	var articles []ArticleListItem
	err := baseQuery.
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
		Order("a.create_time DESC").
		Scopes(util.PaginateScope(page, size)).
		Scan(&articles).Error

	if err != nil {
		return nil, err
	}

	if len(articles) == 0 {
		return util.Paginate(count, articles, page, size), nil
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
	err = db.
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

	return util.Paginate(count, articles, page, size), nil
}

func InsertCategory(title string) error {
	category := Category{Title: title}
	return db.Create(&category).Error
}

func UpdateCategoryTitle(id int, title string) error {
	result := db.Model(&Category{}).Where("id = ?", id).Update("title", title)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("更新失败")
	}
	return nil
}

func SelectCategoryArticleList() ([]Category, error) {
	var categories []Category
	err := db.Model(&Category{}).Select("id, title").Find(&categories).Error
	return categories, err
}

func SelectAdminList(page, size int) (*util.PageInfo[Category], error) {
	query := db.Model(&Category{}).Order("id DESC")

	var count int64
	if err := query.Count(&count).Error; err != nil {
		return nil, err
	}

	var list []Category
	if err := query.Scopes(util.PaginateScope(page, size)).Find(&list).Error; err != nil {
		return nil, err
	}
	return util.Paginate(count, list, page, size), nil
}
