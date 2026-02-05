package article

import (
	"errors"

	"deslrey-go/pkg/util"

	"gorm.io/gorm"
)

var db *gorm.DB

func InitDB(database *gorm.DB) {
	db = database
}

func SelectList(page, size int) (*util.PageInfo[ArticleListItem], error) {
	query := db.Model(&Article{}).
		Select("article.id, article.title, article.des, article.sticky, article.edit, article.create_time, article.update_time, category.title AS category").
		Joins("LEFT JOIN category ON article.category_id = category.id").
		Where("article.exist = ?", true).
		Order("article.create_time DESC")

	var count int64
	if err := query.Count(&count).Error; err != nil {
		return nil, err
	}

	var list []ArticleListItem
	if err := query.Scopes(util.PaginateScope(page, size)).Find(&list).Error; err != nil {
		return nil, err
	}

	if len(list) > 0 {
		fillArticleTags(list)
	}

	return util.Paginate(count, list, page, size), nil
}

func fillArticleTags(list []ArticleListItem) {
	articleIDs := make([]int, len(list))
	for i, v := range list {
		articleIDs[i] = v.ID
	}

	type ArticleTagRel struct {
		ArticleID int
		TagTitle  string
	}
	var rels []ArticleTagRel

	db.Table("tag").
		Select("article_tag.article_id, tag.title as tag_title").
		Joins("JOIN article_tag ON article_tag.tag_id = tag.id").
		Where("article_tag.article_id IN ?", articleIDs).
		Scan(&rels)

	tagMap := make(map[int][]string)
	for _, rel := range rels {
		tagMap[rel.ArticleID] = append(tagMap[rel.ArticleID], rel.TagTitle)
	}

	for i := range list {
		list[i].Tags = tagMap[list[i].ID]
	}
}

func SelectDetail(articleId int) (ArticleDetail, error) {
	var article ArticleDetail

	if articleId <= 0 {
		return article, errors.New("文章不存在")
	}

	err := db.
		Model(&Article{}).
		Select(`
        article.id, article.title, article.content, article.word_count, 
        article.views, article.read_time, c.title AS category, 
        article.des, article.sticky, article.edit, 
        article.create_time, article.update_time
    `).
		Joins("LEFT JOIN category c ON article.category_id = c.id").
		Where("article.id = ? AND article.exist = ?", articleId, true).
		First(&article).Error

	if err != nil {
		return article, err
	}

	return article, nil
}
