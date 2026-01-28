package results

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// Results 统一响应结构
type Results[T any] struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    T      `json:"data"`
}

// ===== 内部构建方法 =====

func buildFull[T any](data T, code int, msg string) *Results[T] {
	return &Results[T]{
		Code:    code,
		Message: msg,
		Data:    data,
	}
}

// ===== SUCCESS =====

// Ok 返回最简单的成功响应
// 调用: results.Ok()
func Ok() *Results[any] {
	return buildFull[any](nil, ResultSuccess.Code, ResultSuccess.Message)
}

// OkData 返回带数据的成功响应
// 调用: results.OkData(user)
func OkData[T any](data T) *Results[T] {
	return buildFull(data, ResultSuccess.Code, ResultSuccess.Message)
}

// OkMsg 返回只带自定义消息的成功响应
func OkMsg(message string) *Results[any] {
	return buildFull[any](nil, ResultSuccess.Code, message)
}

// OkDataMsg 返回带数据和自定义消息的成功响应
func OkDataMsg[T any](data T, message string) *Results[T] {
	return buildFull(data, ResultSuccess.Code, message)
}

// ===== FAIL =====

// Fail 返回默认失败响应
// 调用: results.Fail()
func Fail() *Results[any] {
	return buildFull[any](nil, ResultFail.Code, ResultFail.Message)
}

// FailMsg 返回带自定义消息的失败响应
func FailMsg(message string) *Results[any] {
	return buildFull[any](nil, ResultFail.Code, message)
}

// Err 直接传入预定义的枚举
// 调用: results.Err(results.NoAuth)
func Err(enum ResultCodeEnum) *Results[any] {
	return buildFull[any](nil, enum.Code, enum.Message)
}

// FailCodeMsg 返回自定义错误码和消息
func FailCodeMsg(code int, message string) *Results[any] {
	return buildFull[any](nil, code, message)
}

// ===== 链式调用 =====

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
