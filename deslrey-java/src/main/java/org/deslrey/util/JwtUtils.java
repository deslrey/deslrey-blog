package org.deslrey.util;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

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
    private static final Key KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

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
                .signWith(KEY)
                .compact();
    }

    public static String getUsernameFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(KEY).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public static boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(KEY).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false; // 无效或过期
        }
    }

    public static void main(String[] args) {
//        String token = generateToken("deslrey");
        String token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkZXNscmV5IiwiaWF0IjoxNzU4NjgzNzQ3LCJleHAiOjE3NTg3NzAxNDd9.MLhQRUpNuaMwwjNtLB-F7SzgYayRC0I8WqJ0vwS6Aoo";
        System.out.println("token = " + token);
        System.out.println("isValid = " + validateToken(token));
        System.out.println("username = " + getUsernameFromToken(token));
    }
}