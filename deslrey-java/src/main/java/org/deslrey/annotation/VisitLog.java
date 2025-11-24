package org.deslrey.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * <br>
 * 访问日志记录
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/24 17:12
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface VisitLog {
}
