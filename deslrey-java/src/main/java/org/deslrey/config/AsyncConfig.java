package org.deslrey.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * <br>
 * 线程池
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/12/15 15:29
 */
@EnableAsync
@Configuration
public class AsyncConfig {

    @Bean("visitLogExecutor")
    public Executor visitLogExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("visit-log-");
        executor.initialize();
        return executor;
    }
}