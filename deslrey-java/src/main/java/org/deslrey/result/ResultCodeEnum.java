package org.deslrey.result;

import lombok.Getter;

/**
 * <br>
 * 统一返回结果状态信息类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 15:35
 */
@Getter
public enum ResultCodeEnum {

    SUCCESS(200, "请求成功"),
    FAIL(201, "失败"),
    EMPTY_VALUE(202, "传入的参数存在空值"),
    SERVICE_ERROR(2012, "服务异常"),
    DATA_ERROR(204, "数据异常"),
    ILLEGAL_REQUEST(205, "非法请求"),
    REPEAT_SUBMIT(206, "重复提交"),
    ARGUMENT_VALID_ERROR(210, "参数校验异常"),

    LOGIN_AUTH(208, "未登陆"),
    PERMISSION(209, "没有权限"),
    ACCOUNT_ERROR(214, "账号不正确"),
    PASSWORD_ERROR(215, "密码不正确"),
    LOGIN_MOBILE_ERROR(216, "账号不正确"),
    ACCOUNT_STOP(217, "账号已停用"),
    ACCOUNT_EXIST(216, "用户已存在"),

    CODE_404(404, "请求地址不存在"),
    CODE_600(600, "请求参数错误"),
    CODE_601(601, "信息已经存在"),
    CODE_500(500, "服务器返回错误，请联系管理员"),
    CODE_501(501, "非法请求参数"),
    CODE_901(901, "登录超时，请重新登录");

    private final Integer code;
    private final String message;

    ResultCodeEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
