package draft

import "time"

type Draft struct {
	ID        int `gorm:"primaryKey" json:"id"`
	ArticleID int `json:"articleId"`

	Title   string `json:"title"`
	Content string `json:"content"`

	Des string `json:"des"`

	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

func (Draft) TableName() string {
	return "draft"
}

type AddDraftRequest struct {
	ArticleID *int   `json:"articleId"`
	Title     string `json:"title" binding:"required"`
	Content   string `json:"content"`
	Des       string `json:"des"`
}

type UpdateDraftRequest struct {
	ID        int    `json:"id" binding:"required"`
	ArticleID *int   `json:"articleId"`
	Title     string `json:"title"`
	Content   string `json:"content"`
	Des       string `json:"des"`
}
