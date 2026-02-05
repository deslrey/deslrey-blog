package user

import "time"

type UserInfo struct {
	ID int `gorm:"primaryKey" json:"id"`

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

type LoginRequest struct {
	UserName string `json:"userName" binding:"required"`
	PassWord string `json:"passWord" binding:"required"`
}

type LoginResponse struct {
	Token    string `json:"token"`
	UserName string `json:"userName"`
}

type RegisterRequest struct {
	UserName string `json:"userName" binding:"required"`
	PassWord string `json:"passWord" binding:"required"`
	Email    string `json:"email"`
}
