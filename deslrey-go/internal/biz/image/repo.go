package image

import (
	"errors"
	"os"
	"path/filepath"

	"deslrey-go/internal/config"
	"deslrey-go/pkg/util"

	"gorm.io/gorm"
)

var db *gorm.DB

func InitDB(database *gorm.DB) {
	db = database
}

func SelectAdminList(page, size int) (*util.PageInfo[ImageItem], error) {
	query := db.Model(&Image{}).
		Select("image.id, folder.folder_name, image.image_name, image.origin_name, image.path, image.url, image.size, image.create_time").
		Joins("LEFT JOIN folder ON image.folder_id = folder.id").
		Order("image.id DESC")

	var count int64
	if err := query.Count(&count).Error; err != nil {
		return nil, err
	}

	var list []ImageItem
	if err := query.Scopes(util.PaginateScope(page, size)).Find(&list).Error; err != nil {
		return nil, err
	}
	return util.Paginate(count, list, page, size), nil
}

func SelectFolderById(folderId int) (*Folder, error) {
	var folder Folder
	err := db.Table("folder").Where("id = ?", folderId).First(&folder).Error
	if err != nil {
		return nil, err
	}
	return &folder, nil
}

func InsertImage(image *Image) error {
	return db.Create(image).Error
}

func SelectByFolderName(folderName string) ([]ImageItem, error) {
	var list []ImageItem
	err := db.Model(&Image{}).
		Select("image.id, folder.folder_name, image.image_name, image.origin_name, image.path, image.url, image.size, image.create_time").
		Joins("LEFT JOIN folder ON image.folder_id = folder.id").
		Where("folder.folder_name LIKE ?", "%"+folderName+"%").
		Order("image.id DESC").
		Find(&list).Error
	return list, err
}

func DeleteImage(imageId int) error {
	var image Image
	if err := db.First(&image, imageId).Error; err != nil {
		return errors.New("图片不存在")
	}

	if err := db.Delete(&image).Error; err != nil {
		return err
	}

	filePath := filepath.Join(config.Config.Custom.StaticSourcePath, image.Path, image.Url)
	if err := os.Remove(filePath); err != nil {
		return errors.New("删除文件失败")
	}

	return nil
}

type Folder struct {
	ID   int    `json:"id"`
	Path string `json:"path"`
}
