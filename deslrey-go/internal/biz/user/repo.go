package user

import (
	"errors"

	"gorm.io/gorm"
)

var db *gorm.DB

func InitDB(database *gorm.DB) {
	db = database
}

func SelectByUserName(userName string) (*UserInfo, error) {
	var user UserInfo
	err := db.Where("user_name = ?", userName).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func CheckByUserName(userName, password string) (*UserInfo, error) {
	user, err := SelectByUserName(userName)
	if err != nil {
		return nil, ErrInvalidCredentials
	}
	hashedPassword := hashPasswordWithSalt(password, user.Salt)
	if hashedPassword != user.PassWord {
		return nil, ErrInvalidCredentials
	}
	return user, nil
}

func CheckExist(userName string) (bool, error) {
	var count int64
	err := db.Model(&UserInfo{}).Where("user_name = ?", userName).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func Create(user *UserInfo) error {
	return db.Create(user).Error
}

func SelectByID(id int) (*UserInfo, error) {
	var user UserInfo
	err := db.First(&user, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func UpdateUserName(oldName, newName string) error {
	user, err := SelectByUserName(oldName)
	if err != nil {
		return errors.New("用户不存在")
	}

	result := db.Model(&UserInfo{}).Where("id = ?", user.ID).Update("user_name", newName)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("更新失败")
	}
	return nil
}

func UpdatePassword(userId int, oldPassword, newPassword string) error {
	user, err := SelectByID(userId)
	if err != nil || user == nil {
		return errors.New("用户不存在")
	}

	hashedOldPassword := hashPasswordWithSalt(oldPassword, user.Salt)
	if hashedOldPassword != user.PassWord {
		return errors.New("原密码错误")
	}

	hashedNewPassword := hashPasswordWithSalt(newPassword, user.Salt)
	result := db.Model(&UserInfo{}).Where("id = ?", userId).Update("pass_word", hashedNewPassword)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("更新失败")
	}
	return nil
}
