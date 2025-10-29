package org.deslrey.annotation;

import java.lang.annotation.*;

/**
 * <br>
 * JWT 身份验证拦截器注解
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/10/29 8:46
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequireLogin {
}