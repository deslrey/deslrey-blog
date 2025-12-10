package org.deslrey.task;

import lombok.extern.slf4j.Slf4j;
import org.deslrey.mapper.ArticleMapper;
import org.deslrey.util.DataInitUtils;
import org.deslrey.util.RedisUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * <br>
 * 访问量统计定时器
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/24 18:53
 */
@Slf4j
@Component
public class ArticlePvSyncTask {

    @Autowired
    private RedisUtils redisUtils;

    @Autowired
    private ArticleMapper articleMapper;

    @Autowired
    private DataInitUtils dataInitUtils;

    /**
     * 每 5 分钟同步 Redis PV 到 MySQL
     */
    @Scheduled(cron = "0 */5 * * * ?") // 每 5 分钟执行一次
    public void syncPvToDB() {
        log.info("======      开始同步访问量      ======");
        Map<Object, Object> pvMap = redisUtils.hgetAll("article:pv");
        if (pvMap == null || pvMap.isEmpty()) return;

        for (Map.Entry<Object, Object> entry : pvMap.entrySet()) {
            int pv = Integer.parseInt(entry.getValue().toString());
            if (pv == 0) {
                // PV 为 0，跳过
                continue;
            }
            Integer articleId = Integer.valueOf(entry.getKey().toString());
            // 更新 MySQL 中 view_count
            articleMapper.updateViewCount(articleId, pv);

            // 原子重置 PV
            redisUtils.hset("article:pv", articleId.toString(), "0");
        }
        log.info("======      访问量同步完成      ======");
    }

    @Scheduled(cron = "0 0 */3 * * ?") // 每 3 小时执行一次
    public void syncCount() {
        log.info("======      开始同步标签和分类统计      ======");
        dataInitUtils.CategoryInit();
        dataInitUtils.TagInit();
        log.info("======      标签和分类统计同步完成      ======");
    }
}