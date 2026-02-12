package folder

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

func SelectFolderNameList() ([]FolderNameItem, error) {
	query := db.Model(&Folder{}).Select("id, folder_name").Order("id DESC").Limit(10)

	var count int64
	if err := query.Count(&count).Error; err != nil {
		return nil, err
	}

	var list []FolderNameItem
	if err := query.Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func SelectAdminList(page, size int) (*util.PageInfo[Folder], error) {
	query := db.Model(&Folder{}).Order("create_time DESC")

	var count int64
	if err := query.Count(&count).Error; err != nil {
		return nil, err
	}

	var list []Folder
	if err := query.Scopes(util.PaginateScope(page, size)).Find(&list).Error; err != nil {
		return nil, err
	}
	return util.Paginate(count, list, page, size), nil
}

func InsertFolder(folderName string) error {
	folder := Folder{
		FolderName: folderName,
		Path:       folderName,
		CreateTime: time.Now(),
		UpdateTime: time.Now(),
	}
	return db.Create(&folder).Error
}

func UpdateFolder(id int, folderName string) error {
	result := db.Model(&Folder{}).Where("id = ?", id).Updates(map[string]interface{}{
		"folder_name": folderName,
		"update_time": time.Now(),
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("更新失败")
	}
	return nil
}
