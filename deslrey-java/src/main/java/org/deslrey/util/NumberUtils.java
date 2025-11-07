package org.deslrey.util;

/**
 * <br>
 * 数字校验工具类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 19:52
 */
public class NumberUtils {


    public static boolean isNull(Integer number) {
        return number == null;
    }

    public static boolean isNotNull(Integer number) {
        return !(isNull(number));
    }

    public static boolean isLessZero(Integer number) {
        if (isNull(number))
            return true;
        return number <= 0;
    }


}
