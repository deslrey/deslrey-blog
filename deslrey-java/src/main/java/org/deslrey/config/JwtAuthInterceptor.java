package org.deslrey.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.deslrey.annotation.RequireLogin;
import org.deslrey.result.ResultCodeEnum;
import org.deslrey.result.Results;
import org.deslrey.util.JwtUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

/**
 * <br>
 * JWT 身份验证拦截器
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/10/29 9:34
 */
@Component
public class JwtAuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        boolean needAuth = handlerMethod.hasMethodAnnotation(RequireLogin.class)
                || handlerMethod.getBeanType().isAnnotationPresent(RequireLogin.class);

        if (!needAuth) {
            return true;
        }

        // 校验 token
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("token-")) {
            writeUnauthorized(response);
            return false;
        }

        String token = authHeader.substring("token-".length());
        String username = JwtUtils.getUsernameFromToken(token);
        if (username == null) {
            writeUnauthorized(response);
            return false;
        }

        // 设置认证信息
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 自动续期
        if (JwtUtils.isTokenExpiringSoon(token, 5 * 60 * 1000)) {
            String newToken = JwtUtils.generateToken(username);
            response.setHeader("Authorization", "token-" + newToken);
        }

        return true;
    }

    private void writeUnauthorized(HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(
                new ObjectMapper().writeValueAsString(Results.fail(ResultCodeEnum.CODE_401))
        );
    }
}