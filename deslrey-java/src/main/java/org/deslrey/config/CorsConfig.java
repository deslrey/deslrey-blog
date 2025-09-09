package org.deslrey.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * <br>
 * 跨域配置
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/9 21:54
 */
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // 允许跨域的路径
                        .allowedOriginPatterns("*") // 允许的域名（* 表示所有）
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true) // 允许携带 cookie
                        .maxAge(3600); // 预检请求的缓存时间
            }
        };
    }
}