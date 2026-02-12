package article

import "time"

type Article struct {
	ID int `gorm:"primaryKey" json:"id"`

	Title   string `json:"title"`
	Content string `json:"content"`

	WordCount int `json:"wordCount"`
	Views     int `json:"views"`
	ReadTime  int `json:"readTime"`

	CategoryID int `json:"categoryId"`

	Des    string `json:"des"`
	Sticky bool   `json:"sticky"`
	Edit   bool   `json:"edit"`
	Exist  bool   `json:"exist"`

	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

func (Article) TableName() string {
	return "article"
}

type ArticleTag struct {
	ArticleID int `gorm:"primaryKey" json:"articleId"`
	TagID     int `gorm:"primaryKey" json:"tagId"`
}

func (ArticleTag) TableName() string {
	return "article_tag"
}

type ArticleWebListItem struct {
	ID         int       `json:"id"`
	Title      string    `json:"title"`
	Des        string    `json:"des"`
	Category   string    `json:"category"`
	Tags       []string  `json:"tags"`
	Sticky     bool      `json:"sticky"`
	Edit       bool      `json:"edit"`
	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

type ArticleDetail struct {
	ID         int       `json:"id"`
	Title      string    `json:"title"`
	Content    string    `json:"content"`
	WordCount  int       `json:"wordCount"`
	Views      int       `json:"views"`
	ReadTime   int       `json:"readTime"`
	Category   string    `json:"category"`
	Des        string    `json:"des"`
	Sticky     bool      `json:"sticky"`
	Edit       bool      `json:"edit"`
	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

type ArticleAdminListItem struct {
	ID         int       `json:"id"`
	Title      string    `json:"title"`
	Category   string    `json:"category"`
	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
	Views      int       `json:"views"`
	Sticky     bool      `json:"sticky"`
	Edit       bool      `json:"edit"`
	Exist      bool      `json:"exist"`
}

type ArticleViewHot struct {
	Title string `json:"title"`
	Views int    `json:"views"`
}

type ArticleDraft struct {
	ID         int       `json:"id"`
	Title      string    `json:"title"`
	Content    string    `json:"content"`
	Des        string    `json:"des"`
	CategoryID int       `json:"categoryId"`
	TagIdList  []int     `json:"tagIdList"`
	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

type ArticleEditVO struct {
	ID        int      `json:"id"`
	Title     string   `json:"title"`
	Content   string   `json:"content"`
	Des       string   `json:"des"`
	TagIdList []int    `json:"tagIdList"`
	Category  Category `json:"category"`
}

type Category struct {
	ID    int    `json:"id"`
	Title string `json:"categoryTitle"`
}

type AddArticleRequest struct {
	ID         *int   `json:"id"`
	Title      string `json:"title" binding:"required"`
	Content    string `json:"content"`
	Des        string `json:"des"`
	CategoryID *int   `json:"categoryId"`
	TagIdList  []int  `json:"tagIdList"`
}

type EditExistRequest struct {
	ID    int  `json:"id" binding:"required"`
	Exist bool `json:"exist"`
}
