package tag

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
		Table("tag t").
		Select("t.id, t.title, COUNT(a.id) AS count").
		Joins("LEFT JOIN article_tag at ON t.id = at.tag_id").
		Joins("LEFT JOIN article a ON a.id = at.article_id AND a.exist = true").
		Group("t.id, t.title").
		Order("count DESC").
		Scan(&list).Error

	return list, err
}

func SelectArticles(tagId, page, size int) (*util.PageInfo[ArticleListItem], error) {
	baseQuery := db.
		Table("article a").
		Joins("JOIN article_tag at ON at.article_id = a.id").
		Where("at.tag_id = ?", tagId).
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
			a.sticky,
			a.edit,
			a.create_time,
			a.update_time,
			c.title AS category
		`).
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

func InsertTag(title string) error {
	tag := Tag{Title: title}
	return db.Create(&tag).Error
}

func UpdateTagTitle(id int, title string) error {
	result := db.Model(&Tag{}).Where("id = ?", id).Update("title", title)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("更新失败")
	}
	return nil
}

func SelectTagNameList() ([]Tag, error) {
	var tags []Tag
	err := db.Model(&Tag{}).Select("id, title").Find(&tags).Error
	return tags, err
}

func SelectAdminList(page, size int) (*util.PageInfo[Tag], error) {
	query := db.Model(&Tag{}).Order("id DESC")

	var count int64
	if err := query.Count(&count).Error; err != nil {
		return nil, err
	}

	var list []Tag
	if err := query.Scopes(util.PaginateScope(page, size)).Find(&list).Error; err != nil {
		return nil, err
	}
	return util.Paginate(count, list, page, size), nil
}
