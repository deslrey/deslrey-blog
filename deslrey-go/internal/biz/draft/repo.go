package draft

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

func SelectAdminList(page, size int) (*util.PageInfo[Draft], error) {
	query := db.Model(&Draft{}).Order("create_time DESC")

	var count int64
	if err := query.Count(&count).Error; err != nil {
		return nil, err
	}

	var list []Draft
	if err := query.Scopes(util.PaginateScope(page, size)).Find(&list).Error; err != nil {
		return nil, err
	}
	return util.Paginate(count, list, page, size), nil
}

func SelectById(id int) (*Draft, error) {
	var draft Draft
	err := db.First(&draft, id).Error
	if err != nil {
		return nil, errors.New("草稿不存在")
	}
	return &draft, nil
}

func InsertDraft(req *AddDraftRequest) error {
	var articleID int
	if req.ArticleID != nil {
		articleID = *req.ArticleID
	}

	if articleID > 0 {
		var existingDraft Draft
		err := db.Where("article_id = ?", articleID).First(&existingDraft).Error
		if err == nil {
			return db.Model(&Draft{}).Where("id = ?", existingDraft.ID).Updates(map[string]interface{}{
				"title":       req.Title,
				"content":     req.Content,
				"des":         req.Des,
				"update_time": time.Now(),
			}).Error
		}
	}

	draft := Draft{
		ArticleID:  articleID,
		Title:      req.Title,
		Content:    req.Content,
		Des:        req.Des,
		CreateTime: time.Now(),
		UpdateTime: time.Now(),
	}
	return db.Create(&draft).Error
}

func UpdateDraft(req *UpdateDraftRequest) error {
	var articleID int
	if req.ArticleID != nil {
		articleID = *req.ArticleID
	}

	result := db.Model(&Draft{}).Where("id = ?", req.ID).Updates(map[string]interface{}{
		"article_id":  articleID,
		"title":       req.Title,
		"content":     req.Content,
		"des":         req.Des,
		"update_time": time.Now(),
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		draft := Draft{
			ID:         req.ID,
			ArticleID:  articleID,
			Title:      req.Title,
			Content:    req.Content,
			Des:        req.Des,
			CreateTime: time.Now(),
			UpdateTime: time.Now(),
		}
		return db.Create(&draft).Error
	}
	return nil
}

func DeleteDraft(id int) error {
	result := db.Delete(&Draft{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("删除失败")
	}
	return nil
}
