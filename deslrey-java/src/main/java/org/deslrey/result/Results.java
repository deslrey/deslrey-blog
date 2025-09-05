package org.deslrey.result;

import lombok.Data;

/**
 * <br>
 * 统一结果返回类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 15:33
 */
@Data
public class Results<T> {

    //返回码
    private Integer code;

    //返回消息
    private String message;

    //返回数据
    private T data;


    // 返回数据
    protected static <T> Results<T> build(T data) {
        Results<T> results = new Results<T>();
        if (data != null)
            results.setData(data);
        return results;
    }

    protected static <T> Results<T> build(T body, Integer code, String message) {
        Results<T> results = build(body);
        results.setCode(code);
        results.setMessage(message);
        return results;
    }

    protected static <T> Results<T> build(T body, ResultCodeEnum resultCodeEnum) {
        Results<T> results = build(body);
        results.setCode(resultCodeEnum.getCode());
        results.setMessage(resultCodeEnum.getMessage());
        return results;
    }

    public static <T> Results<T> ok() {
        return Results.ok(null);
    }

    /**
     * 操作成功
     */
    public static <T> Results<T> ok(T data) {
        return build(data, ResultCodeEnum.SUCCESS);
    }

    /**
     * 操作成功
     */
    public static <T> Results<T> ok(String message) {
        return build(null, 200, message);
    }

    /**
     * 操作成功
     */
    public static <T> Results<T> ok(T data, String message) {
        return build(data, 200, message);
    }


    /**
     * 操作失败
     */
    public static <T> Results<T> fail(T data) {
        return build(data, ResultCodeEnum.FAIL);
    }

    public static <T> Results<T> fail(String message) {
        return build(null, 500, message);
    }

    public static <T> Results<T> fail(Integer code, String message) {
        return build(null, code, message);
    }


    public static <T> Results<T> fail() {
        return fail(null, ResultCodeEnum.FAIL);
    }

    public static <T> Results<T> fail(T data, ResultCodeEnum resultCodeEnum) {
        return build(data, resultCodeEnum);
    }

    public static <T> Results<T> fail(ResultCodeEnum resultCodeEnum) {
        return build(null, resultCodeEnum);
    }

    public Results<T> message(String msg) {
        this.setMessage(msg);
        return this;
    }

    public Results<T> code(Integer code) {
        this.setCode(code);
        return this;
    }
}