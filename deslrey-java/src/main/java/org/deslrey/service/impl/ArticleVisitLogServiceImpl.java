package org.deslrey.service.impl;


import jakarta.servlet.http.HttpServletRequest;
import org.deslrey.entity.po.ArticleVisitLog;
import org.deslrey.mapper.ArticleVisitLogMapper;
import org.deslrey.service.ArticleVisitLogService;
import org.deslrey.util.IPUtils;
import org.deslrey.util.RedisUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 文章访问日志表 服务实现类
 * </p>
 *
 * @author deslrey
 * @since 2025-11-24
 */
@Service
public class ArticleVisitLogServiceImpl implements ArticleVisitLogService {

    @Autowired
    private ArticleVisitLogMapper logMapper;

    @Autowired
    private RedisUtils redisUtils;

    @Override
    @Async("visitLogExecutor")
    public void recordAsync(Integer articleId, String ip, String ua, String referer) {
        // 1. Redis 去重
        String visitKey = "article:visit:" + articleId + ":" + ip;
        if (redisUtils.hasKey(visitKey)) {
            return;
        }
        redisUtils.set(visitKey, "1", 30);

        // 2. Redis PV
        String pvKey = "article:pv";
        redisUtils.hincrBy(pvKey, articleId.toString(), 1);

        // 3. 记录日志
        String location = IPUtils.isLocalAccess(ip) ? "本机访问" : IPUtils.queryIPLocation(ip);
        String device = IPUtils.getDeviceType(ua);

        ArticleVisitLog log = new ArticleVisitLog();
        log.setArticleId(articleId);
        log.setIp(ip);
        log.setLocation(location);
        log.setUserAgent(ua);
        log.setReferer(referer);
        log.setDevice(device);

        logMapper.insertVisitLog(log);
    }

}
