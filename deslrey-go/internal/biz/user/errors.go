package user

import "errors"

var (
	ErrUserExist          = errors.New("用户名已存在")
	ErrInvalidCredentials = errors.New("用户名或密码错误")
)
