package article

import (
	"errors"
	"time"

	"deslrey-go/pkg/util"

	"gorm.io/gorm"
)

var db *gorm.DB

func InitDB(database *gorm.DB) {
	db = database
}

func SelectWebList(page, size int) (*util.PageInfo[ArticleWebListItem], error) {
	query := db.Model(&Article{}).
		Select("article.id, article.title, article.des, article.sticky, article.edit, article.create_time, article.update_time, category.title AS category").
		Joins("LEFT JOIN category ON article.category_id = category.id").
		Where("article.exist = ?", true).
		Order("article.create_time DESC")

	var count int64
	if err := query.Count(&count).Error; err != nil {
		return nil, err
	}

	var list []ArticleWebListItem
	if err := query.Scopes(util.PaginateScope(page, size)).Find(&list).Error; err != nil {
		return nil, err
	}

	if len(list) > 0 {
		fillArticleTags(list)
	}

	return util.Paginate(count, list, page, size), nil
}

func SelectAdminList(page, size int) (*util.PageInfo[ArticleAdminListItem], error) {
	query := db.Model(&Article{}).
		Select("article.id, article.title, category.title AS category, article.create_time, article.update_time, article.views, article.sticky, article.edit, article.exist").
		Joins("LEFT JOIN category ON article.category_id = category.id").
		Order("article.id DESC")

	var count int64
	if err := query.Count(&count).Error; err != nil {
		return nil, err
	}

	var list []ArticleAdminListItem
	if err := query.Scopes(util.PaginateScope(page, size)).Find(&list).Error; err != nil {
		return nil, err
	}

	return util.Paginate(count, list, page, size), nil
}

func fillArticleTags(list []ArticleWebListItem) {
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

func SelectViewHot() ([]ArticleViewHot, error) {
	var viewHots []ArticleViewHot

	err := db.Model(&Article{}).
		Select("title, views").
		Where("exist = ?", true).
		Order("views DESC").
		Limit(10).
		Scan(&viewHots).
		Error

	if err != nil {
		return nil, err
	}

	return viewHots, nil
}

func SelectEditArticle(articleId int) (*ArticleEditVO, error) {
	var article Article

	err := db.First(&article, articleId).Error
	if err != nil {
		return nil, errors.New("获取编辑文章失败，暂无数据")
	}

	var tagIds []int
	err = db.Table("article_tag").
		Select("tag_id").
		Where("article_id = ?", articleId).
		Pluck("tag_id", &tagIds).Error
	if err != nil {
		tagIds = []int{}
	}

	var category Category
	err = db.Table("category").
		Select("id, title").
		Where("id = ?", article.CategoryID).
		First(&category).Error
	if err != nil {
		category = Category{}
	}

	return &ArticleEditVO{
		ID:        article.ID,
		Title:     article.Title,
		Content:   article.Content,
		Des:       article.Des,
		TagIdList: tagIds,
		Category:  category,
	}, nil
}

func InsertOrUpdateArticle(req *AddArticleRequest) error {
	return db.Transaction(func(tx *gorm.DB) error {
		var categoryID int
		if req.CategoryID != nil {
			categoryID = *req.CategoryID
		}

		article := Article{
			Title:      req.Title,
			Content:    req.Content,
			Des:        req.Des,
			CategoryID: categoryID,
			WordCount:  len(req.Content),
			ReadTime:   max(1, len(req.Content)/200),
		}

		now := time.Now()

		if req.ID == nil {
			article.Views = 0
			article.CreateTime = now
			article.UpdateTime = now
			article.Edit = false
			article.Exist = true

			if err := tx.Create(&article).Error; err != nil {
				return err
			}
		} else {
			article.ID = *req.ID
			article.UpdateTime = now
			article.Edit = true

			if err := tx.Model(&Article{}).Where("id = ?", *req.ID).
				Updates(map[string]interface{}{
					"title":       article.Title,
					"content":     article.Content,
					"des":         article.Des,
					"category_id": article.CategoryID,
					"word_count":  article.WordCount,
					"read_time":   article.ReadTime,
					"update_time": article.UpdateTime,
					"edit":        article.Edit,
				}).Error; err != nil {
				return err
			}

			if err := tx.Table("article_tag").
				Where("article_id = ?", *req.ID).
				Delete(nil).Error; err != nil {
				return err
			}
		}

		if len(req.TagIdList) > 0 {
			articleId := article.ID
			if req.ID != nil {
				articleId = *req.ID
			}
			for _, tagId := range req.TagIdList {
				if err := tx.Table("article_tag").
					Create(map[string]interface{}{
						"article_id": articleId,
						"tag_id":     tagId,
					}).Error; err != nil {
					return err
				}
			}
		}

		return nil
	})
}

func UpdateArticleExist(id int, exist bool) error {
	result := db.Model(&Article{}).Where("id = ?", id).
		Update("exist", exist)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("操作失败")
	}
	return nil
}
