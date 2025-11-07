package org.deslrey.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * <br>
 * web配置
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/7 18:58
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${custom.static-source-path}")
    private String staticSourcePath;


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = "file:" + staticSourcePath;
        if (!location.endsWith("/")) {
            location += "/";
        }
        registry.addResourceHandler("/staticSource/**")
                .addResourceLocations(location);
    }
}