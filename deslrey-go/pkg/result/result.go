package result

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Results[T any] struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    T      `json:"data"`
}

func buildFull[T any](data T, code int, msg string) *Results[T] {
	return &Results[T]{
		Code:    code,
		Message: msg,
		Data:    data,
	}
}

func Ok() *Results[any] {
	return buildFull[any](nil, ResultSuccess.Code, ResultSuccess.Message)
}

func OkData[T any](data T) *Results[T] {
	return buildFull(data, ResultSuccess.Code, ResultSuccess.Message)
}

func OkMsg(message string) *Results[any] {
	return buildFull[any](nil, ResultSuccess.Code, message)
}

func OkDataMsg[T any](data T, message string) *Results[T] {
	return buildFull(data, ResultSuccess.Code, message)
}

func Fail() *Results[any] {
	return buildFull[any](nil, ResultFail.Code, ResultFail.Message)
}

func FailMsg(message string) *Results[any] {
	return buildFull[any](nil, ResultFail.Code, message)
}

func Err(enum ResultCodeEnum) *Results[any] {
	return buildFull[any](nil, enum.Code, enum.Message)
}

func FailCodeMsg(code int, message string) *Results[any] {
	return buildFull[any](nil, code, message)
}

func (r *Results[T]) WithMessage(msg string) *Results[T] {
	r.Message = msg
	return r
}

func (r *Results[T]) WithCode(c int) *Results[T] {
	r.Code = c
	return r
}

func (r *Results[T]) WithData(data T) *Results[T] {
	r.Data = data
	return r
}

func (r *Results[T]) Send(c *gin.Context) {
	c.JSON(http.StatusOK, r)
}

func (r *Results[T]) SendCode(code int, c *gin.Context) {
	c.JSON(code, r)
}
