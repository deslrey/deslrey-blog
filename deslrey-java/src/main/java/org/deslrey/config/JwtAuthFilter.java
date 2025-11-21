package org.deslrey.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.deslrey.util.JwtUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


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
            String token = authHeader.substring("token-".length());
            String username = JwtUtils.getUsernameFromToken(token);

            if (username != null) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // 自动续期
                if (JwtUtils.isTokenExpiringSoon(token, 5 * 60 * 1000)) {
                    String newToken = JwtUtils.generateToken(username);
                    response.setHeader("Authorization", "token-" + newToken);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}