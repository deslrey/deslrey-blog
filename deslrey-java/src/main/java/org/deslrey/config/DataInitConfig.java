package org.deslrey.config;

import lombok.extern.slf4j.Slf4j;
import org.deslrey.util.DataInitUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * <br>
 * 初始化缓存数据
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/12/10 20:27
 */
@Slf4j
@Component
public class DataInitConfig implements CommandLineRunner {

    @Autowired
    private DataInitUtils dataInitUtils;

    @Override
    public void run(String... args) throws Exception {
        dataInitUtils.CategoryInit();
        dataInitUtils.TagInit();
        log.info("分类与标签缓存成功");
    }
}
