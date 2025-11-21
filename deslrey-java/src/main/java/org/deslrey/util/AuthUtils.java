package org.deslrey.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


/**
 * <br>
 * 登陆用户信息工具类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/26 18:37
 */
public class AuthUtils {

    /**
     * 获取当前登录用户名（从 SecurityContextHolder）
     */
    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() != null) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof String) {
                return (String) principal;
            }
        }
        return null; // 未登录或异常
    }

    /**
     * 判断当前是否已登录
     */
    public static boolean isAuthenticated() {
        return getCurrentUsername() != null;
    }

    /**
     * 从请求头中获取原始 token
     */
    public static String getTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("token-")) {
            return authHeader.replaceFirst("token-", "");
        }
        return null;
    }

    /**
     * 从请求中获取用户名（解析 token）
     */
    public static String getUsernameFromRequest(HttpServletRequest request) {
        String token = getTokenFromRequest(request);
        if (token != null) {
            return JwtUtils.getUsernameFromToken(token);
        }
        return null;
    }
}
