package org.deslrey.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.deslrey.result.ResultCodeEnum;

import java.io.Serial;

/**
 * <br>
 * 自定义全全局异常
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/6 13:11
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class DeslreyException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;
    private final Integer code;
    private final String msg;

    public DeslreyException(ResultCodeEnum resultCodeEnum) {
        super(resultCodeEnum.getMessage());
        this.code = resultCodeEnum.getCode();
        this.msg = resultCodeEnum.getMessage();
    }

    public DeslreyException(String msg, Throwable e) {
        super(msg, e);
        this.code = ResultCodeEnum.CODE_500.getCode();
        this.msg = msg;
    }

}
