package results

// ResultCodeEnum 错误码枚举结构
type ResultCodeEnum struct {
	Code    int
	Message string
}

// 预定义状态
var (
	ResultSuccess = ResultCodeEnum{200, "操作成功"}
	ResultFail    = ResultCodeEnum{500, "操作失败"}
	ParamError    = ResultCodeEnum{400, "参数错误"}
	NotFound      = ResultCodeEnum{404, "未找到资源"}
	NoAuth        = ResultCodeEnum{403, "无权限"}
)
