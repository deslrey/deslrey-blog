package org.deslrey.exception;

import lombok.extern.slf4j.Slf4j;
import org.deslrey.result.ResultCodeEnum;
import org.deslrey.result.Results;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

/**
 * <br>
 * 自定义异常处理器
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/6 13:13
 */
@Slf4j
@RestControllerAdvice
public class DeslreyExceptionHandler {

    protected static final String STATUS_SUCCESS = "success";

    protected static final String STATUS_ERROR = "error";

    /**
     * 处理自定义异常
     */
    @ExceptionHandler(DeslreyException.class)
    public Results<String> handleRenException(DeslreyException ex) {

        return Results.fail(ex.getCode(), ex.getMsg());
    }

    /**
     * SpringMVC参数绑定，Validator校验不正确
     */
    @ExceptionHandler(BindException.class)
    public Results<String> bindException(BindException ex) {
        FieldError fieldError = ex.getFieldError();
        assert fieldError != null;
        return Results.fail(fieldError.getDefaultMessage());
    }


    @ExceptionHandler(Exception.class)
    public Results<String> handleException(Exception e) {
        log.error(e.getMessage(), e);
        Results<String> response = new Results<>();
        //404
        if (e instanceof NoHandlerFoundException) {
            response.setCode(ResultCodeEnum.CODE_404.getCode());
            response.setMessage(ResultCodeEnum.CODE_404.getMessage());
            response.setData(STATUS_ERROR);
        } else if (e instanceof DeslreyException deslreyException) {
            //业务错误
            response.setCode(deslreyException.getCode() == null ? ResultCodeEnum.CODE_600.getCode() : deslreyException.getCode());
            response.setMessage(deslreyException.getMessage());
            response.setData(STATUS_ERROR);
        } else if (e instanceof BindException || e instanceof MethodArgumentTypeMismatchException) {
            //参数类型错误
            response.setCode(ResultCodeEnum.CODE_600.getCode());
            response.setMessage(ResultCodeEnum.CODE_600.getMessage());
            response.setData(STATUS_ERROR);
        } else if (e instanceof DuplicateKeyException) {
            //主键冲突
            response.setCode(ResultCodeEnum.CODE_601.getCode());
            response.setMessage(ResultCodeEnum.CODE_601.getMessage());
            response.setData(STATUS_ERROR);
        } else {
            response.setCode(ResultCodeEnum.CODE_500.getCode());
            response.setMessage(ResultCodeEnum.CODE_500.getMessage());
            response.setData(STATUS_ERROR);
        }
        return response;
    }
}
