package user

import (
	"context"
	"deslrey-go/internal/middleware"
	"deslrey-go/pkg/cache"
	"deslrey-go/pkg/result"
	"deslrey-go/pkg/util"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func HandleRegister(ctx *gin.Context) {
	var req RegisterRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		result.FailMsg("用户名或密码不能为空").SendCode(http.StatusBadRequest, ctx)
		return
	}

	if err := doRegister(&req); err != nil {
		if err == ErrUserExist {
			result.FailMsg(err.Error()).SendCode(http.StatusBadRequest, ctx)
			return
		}
		result.FailMsg("注册失败").SendCode(http.StatusInternalServerError, ctx)
		return
	}

	result.OkMsg("注册成功").Send(ctx)
}

func HandleLogin(ctx *gin.Context) {
	var req LoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		result.FailMsg("用户名或密码不能为空").SendCode(http.StatusBadRequest, ctx)
		return
	}

	resp, err := doLogin(&req)
	if err != nil {
		if err == ErrInvalidCredentials {
			result.FailMsg(err.Error()).SendCode(http.StatusUnauthorized, ctx)
			return
		}
		result.FailMsg("登录失败").SendCode(http.StatusInternalServerError, ctx)
		return
	}

	result.OkData(resp).Send(ctx)
}

func doRegister(req *RegisterRequest) error {
	exist, err := CheckExist(req.UserName)
	if err != nil {
		return err
	}
	if exist {
		return ErrUserExist
	}

	salt := generateSalt()
	hashedPassword := hashPasswordWithSalt(req.PassWord, salt)

	user := &UserInfo{
		UserName:   req.UserName,
		PassWord:   hashedPassword,
		Email:      req.Email,
		Salt:       salt,
		CreateTime: time.Now(),
		UpdateTime: time.Now(),
		Exist:      true,
	}

	return Create(user)
}

func doLogin(req *LoginRequest) (*LoginResponse, error) {
	user, err := CheckByUserName(req.UserName, req.PassWord)
	if err != nil {
		return nil, err
	}

	token, err := util.GenerateToken(user.ID, user.UserName)
	if err != nil {
		return nil, err
	}

	tokenKey := util.GenerateTokenKey(user.ID)
	if err := cache.Set(context.Background(), tokenKey, token, middleware.TokenExpiration); err != nil {
		return nil, err
	}

	return &LoginResponse{
		Token:    "Bearer " + token,
		UserName: user.UserName,
	}, nil
}
