package image

import "time"

type Image struct {
	ID       int `gorm:"primaryKey" json:"id"`
	FolderID int `gorm:"foreignKey:ID" json:"folderId"`

	ImageName  string `json:"imageName"`
	OriginName string `gorm:"column:origin_name" json:"originalName"`
	Path       string `json:"path"`
	Url        string `json:"url"`
	Size       int    `json:"size"`

	CreateTime time.Time `json:"createTime"`
}

func (Image) TableName() string {
	return "image"
}

type ImageItem struct {
	ID         int    `gorm:"primaryKey" json:"id"`
	FolderID   int    `json:"folderId"`
	FolderName string `json:"folderName"`

	ImageName  string `json:"imageName"`
	OriginName string `gorm:"column:origin_name" json:"originalName"`
	Path       string `json:"path"`
	Url        string `json:"url"`
	Size       int    `json:"size"`

	CreateTime time.Time `json:"createTime"`
}

type UploadImageRequest struct {
	FolderID int `form:"folderId" binding:"required"`
}
