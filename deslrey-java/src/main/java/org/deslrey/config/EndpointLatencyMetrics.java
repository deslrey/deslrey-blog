package org.deslrey.config;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * <br>
 * 接口耗时统计类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/12/14 22:27
 */
@Component
public class EndpointLatencyMetrics {

    private final MeterRegistry meterRegistry;

    public EndpointLatencyMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }

    /**
     * 记录接口耗时（ms）
     */
    public void record(String path, long latencyMs) {
        Timer.builder("deslrey_data_endpoints_latency_statistic")
                .description("统计接口耗时(ms)")
                .tag("path", path)
                .register(meterRegistry)
                .record(latencyMs, TimeUnit.MILLISECONDS);
    }
}