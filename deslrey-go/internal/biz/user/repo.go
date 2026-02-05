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
