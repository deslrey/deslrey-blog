package org.deslrey.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;

/**
 * <br>
 * 检查图片存储目录
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/7 19:01
 */
@Slf4j
@Component
public class FolderInitializer implements CommandLineRunner {


    @Value("${custom.static-source-path}")
    private String folderPath;

    @Override
    public void run(String... args) {
        File dir = new File(folderPath);
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            if (created) {
                log.info("图片目录创建成功 ======> {}", folderPath);
            } else {
                log.error("图片目录创建失败 ======> {}", folderPath);
            }
        } else {
            log.info("图片目录已存在 ======> {}", folderPath);
        }
    }
}
