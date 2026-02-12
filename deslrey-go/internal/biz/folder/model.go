package folder

import "time"

type Folder struct {
	ID int `gorm:"primaryKey" json:"id"`

	FolderName string `json:"folderName"`
	Path       string `json:"path"`

	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

func (Folder) TableName() string {
	return "folder"
}

type FolderNameItem struct {
	ID         int    `gorm:"primaryKey" json:"id"`
	FolderName string `json:"folderName"`
}

type FolderItem struct {
	ID         int       `gorm:"primaryKey" json:"id"`
	FolderID   int       `json:"folderId"`
	FolderName string    `json:"folderName"`
	Path       string    `json:"path"`
	CreateTime time.Time `json:"createTime"`
}

type AddFolderRequest struct {
	FolderName string `json:"folderName" binding:"required"`
}

type UpdateFolderRequest struct {
	ID         int    `json:"id" binding:"required"`
	FolderName string `json:"folderName" binding:"required"`
}
