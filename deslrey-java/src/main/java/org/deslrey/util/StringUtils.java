package org.deslrey.util;

import java.util.Collection;
import java.util.Objects;
import java.util.StringJoiner;

/**
 * <br>
 * 字符串工具类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 19:50
 */
public class StringUtils {

    private StringUtils() {
        // 工具类不允许实例化
    }

    /**
     * 判断是否为空（null 或长度为 0）
     */
    public static boolean isEmpty(CharSequence cs) {
        return cs == null || cs.length() == 0;
    }

    /**
     * 判断是否非空
     */
    public static boolean isNotEmpty(CharSequence cs) {
        return !isEmpty(cs);
    }

    /**
     * 判断是否为空白（null、""、全是空格）
     */
    public static boolean isBlank(CharSequence cs) {
        if (cs == null) return true;
        int len = cs.length();
        for (int i = 0; i < len; i++) {
            if (!Character.isWhitespace(cs.charAt(i))) {
                return false;
            }
        }
        return true;
    }

    /**
     * 判断是否非空白
     */
    public static boolean isNotBlank(CharSequence cs) {
        return !isBlank(cs);
    }

    /**
     * 去除字符串两端空格，null 安全
     */
    public static String trim(CharSequence cs) {
        return cs == null ? null : cs.toString().trim();
    }

    /**
     * 将 null 转为 ""（避免 NPE）
     */
    public static String nullToEmpty(CharSequence cs) {
        return cs == null ? "" : cs.toString();
    }

    /**
     * 首字母大写
     */
    public static String capitalize(CharSequence cs) {
        if (isBlank(cs)) return cs == null ? null : cs.toString();
        String str = cs.toString();
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    /**
     * 首字母小写
     */
    public static String uncapitalize(CharSequence cs) {
        if (isBlank(cs)) return cs == null ? null : cs.toString();
        String str = cs.toString();
        return str.substring(0, 1).toLowerCase() + str.substring(1);
    }

    /**
     * 反转字符串
     */
    public static String reverse(CharSequence cs) {
        if (cs == null) return null;
        return new StringBuilder(cs).reverse().toString();
    }

    /**
     * 重复字符串
     */
    public static String repeat(CharSequence cs, int count) {
        if (cs == null || count <= 0) return "";
        return cs.toString().repeat(count);
    }

    /**
     * 安全的 equals（null 安全）
     */
    public static boolean equals(CharSequence a, CharSequence b) {
        return Objects.equals(a == null ? null : a.toString(),
                b == null ? null : b.toString());
    }

    /**
     * 忽略大小写比较（只能用 String）
     */
    public static boolean equalsIgnoreCase(String a, String b) {
        return a == null ? b == null : a.equalsIgnoreCase(b);
    }

    /**
     * 判断是否包含子串（只能用 String）
     */
    public static boolean contains(String str, String searchStr) {
        return str != null && searchStr != null && str.contains(searchStr);
    }

    /**
     * 字符串拼接（使用分隔符）
     */
    public static String join(Collection<? extends CharSequence> list, String delimiter) {
        if (list == null || list.isEmpty()) return "";
        StringJoiner joiner = new StringJoiner(delimiter);
        for (CharSequence cs : list) {
            if (cs != null) {
                joiner.add(cs.toString());
            }
        }
        return joiner.toString();
    }

    /**
     * 截取字符串（安全，避免 IndexOutOfBoundsException）
     */
    public static String substringSafe(CharSequence cs, int beginIndex, int endIndex) {
        if (cs == null) return null;
        String str = cs.toString();
        int len = str.length();
        if (beginIndex < 0) beginIndex = 0;
        if (endIndex > len) endIndex = len;
        if (beginIndex > endIndex) return "";
        return str.substring(beginIndex, endIndex);
    }
}
