package org.deslrey.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.deslrey.result.ResultCodeEnum;
import org.deslrey.result.Results;
import org.deslrey.util.JwtUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

/**
 * <br>
 * JWT 过滤器
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/25 9:21
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("token-")) {
            String token = authHeader.replaceFirst("token-", "");

            try {
                String username = JwtUtils.getUsernameFromToken(token);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // 自动续期: token 剩余有效期小于 5 分钟就刷新
                if (JwtUtils.isTokenExpiringSoon(token, 5 * 60 * 1000)) {
                    String newToken = JwtUtils.generateToken(username);
                    response.setHeader("Authorization", "token-" + newToken);
                }

            } catch (Exception e) {
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write(
                        new ObjectMapper().writeValueAsString(Results.fail(ResultCodeEnum.CODE_401))
                );
                return;
            }
        }


        filterChain.doFilter(request, response);
    }
}
