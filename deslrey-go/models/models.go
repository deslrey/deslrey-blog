package models

import "time"

type Article struct {
	ID int32 `gorm:"primaryKey" json:"id"`

	Title   string `json:"title"`
	Content string `json:"content"`

	WordCount int32 `json:"wordCount"`
	Views     int32 `json:"views"`
	ReadTime  int32 `json:"readTime"`

	CategoryID int32 `json:"categoryId"`

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
	ArticleID int32 `gorm:"primaryKey" json:"articleId"`
	TagID     int32 `gorm:"primaryKey" json:"tagId"`
}

func (ArticleTag) TableName() string {
	return "article_tag"
}

type Category struct {
	ID int32 `gorm:"primaryKey" json:"id"`

	Title string `json:"title"`

	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

func (Category) TableName() string {
	return "category"
}

type Tag struct {
	ID int32 `gorm:"primaryKey" json:"id"`

	Title string `json:"title"`

	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

func (Tag) TableName() string {
	return "tag"
}

type Draft struct {
	ID int32 `gorm:"primaryKey" json:"id"`

	Title   string `json:"title"`
	Content string `json:"content"`
	Des     string `json:"des"`

	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

func (Draft) TableName() string {
	return "draft"
}

type Folder struct {
	ID int32 `gorm:"primaryKey" json:"id"`

	FolderName string `json:"folderName"`
	Path       string `json:"path"`

	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

func (Folder) TableName() string {
	return "folder"
}

type Image struct {
	ID int32 `gorm:"primaryKey" json:"id"`

	FolderID int32 `json:"folderId"`

	ImageName  string `json:"imageName"`
	OriginName string `json:"originName"`
	Path       string `json:"path"`
	URL        string `json:"url"`
	Size       int64  `json:"size"`

	CreateTime time.Time `json:"createTime"`
}

func (Image) TableName() string {
	return "image"
}

type UserInfo struct {
	ID int32 `gorm:"primaryKey" json:"id"`

	UserName string `json:"userName"`
	PassWord string `json:"passWord"`
	Email    string `json:"email"`
	Salt     string `json:"salt"`
	Avatar   string `json:"avatar"`

	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`

	Exist bool `json:"exist"`
}

func (UserInfo) TableName() string {
	return "user_info"
}

type PageInfo[T any] struct {
	Page        int   `json:"page"`
	PageSize    int   `json:"pageSize"`
	Total       int64 `json:"total"`
	List        []T   `json:"list"`
	HasNextPage bool  `json:"hasNextPage"`
}

type ArticleVO struct {
	ID         int32     `json:"id"`
	Title      string    `json:"title"`
	Des        string    `json:"des"`
	Category   string    `json:"category"`
	Tags       []string  `json:"tags"`
	Sticky     bool      `json:"sticky"`
	Edit       bool      `json:"edit"`
	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

type TitleCount struct {
	ID    int32  `json:"id"`
	Title string `json:"title"`
	Count int32  `json:"count"`
}
