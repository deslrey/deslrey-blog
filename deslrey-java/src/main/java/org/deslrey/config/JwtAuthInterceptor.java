package org.deslrey.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.deslrey.annotation.RequireLogin;
import org.deslrey.result.ResultCodeEnum;
import org.deslrey.result.Results;
import org.deslrey.util.JwtUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;

/**
 * <br>
 * JWT 身份验证拦截器
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/10/29 9:34
 */
@Slf4j
@Component
public class JwtAuthInterceptor implements HandlerInterceptor {

    private final EndpointLatencyMetrics endpointLatencyMetrics;

    public JwtAuthInterceptor(EndpointLatencyMetrics endpointLatencyMetrics) {
        this.endpointLatencyMetrics = endpointLatencyMetrics;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        // 记录开始时间（所有请求都记）
        request.setAttribute("request-start-time", System.currentTimeMillis());

        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        boolean needAuth = handlerMethod.hasMethodAnnotation(RequireLogin.class)
                || handlerMethod.getBeanType().isAnnotationPresent(RequireLogin.class);

        if (!needAuth) {
            return true;
        }

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

        request.setAttribute("jwt-username", username);

        if (JwtUtils.isTokenExpiringSoon(token, 5 * 60 * 1000)) {
            response.setHeader("Authorization", "token-" + JwtUtils.generateToken(username));
        }

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request,
                                HttpServletResponse response,
                                Object handler,
                                Exception ex) {

        Object startObj = request.getAttribute("request-start-time");
        if (startObj == null) {
            return;
        }

        long latencyMs = System.currentTimeMillis() - (long) startObj;
        String path = request.getRequestURI();

        log.info("接口 {} 耗时 {} ms", path, latencyMs);

        endpointLatencyMetrics.record(path, latencyMs);
    }

    private void writeUnauthorized(HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(
                new ObjectMapper().writeValueAsString(Results.fail(ResultCodeEnum.CODE_401))
        );
    }
}
