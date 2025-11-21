package org.deslrey.util;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

/**
 * <br>
 * JWT 生成和验证工具类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/24
 */
public class JwtUtils {

    private static final String SECRET = "deslrey_secret_deslrey_secret_123456";
    private static final Key KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    private static final long EXPIRATION_MS = 1000 * 60 * 60 * 24; // 1 天有效期

    /**
     * 生成带过期时间的 token
     */
    public static String generateToken(String username) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(now)) // 签发时间
                .setExpiration(new Date(now + EXPIRATION_MS)) // 过期时间
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 从 token 中解析用户名
     */
    public static String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * 验证 token 是否有效
     */
    public static boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(KEY).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false; // 无效或过期
        }
    }

    /**
     * 判断 token 是否即将过期
     */
    public static boolean isTokenExpiringSoon(String token, long thresholdMs) {
        try {
            long exp = Jwts.parserBuilder().setSigningKey(KEY).build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration()
                    .getTime();
            long now = System.currentTimeMillis();
            return exp - now < thresholdMs;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }


    public static void main(String[] args) {
        String token = generateToken("deslrey");
        System.out.println("生成的 token = " + token);
        System.out.println("是否有效 = " + validateToken(token));
        System.out.println("用户名 = " + getUsernameFromToken(token));
    }
}
