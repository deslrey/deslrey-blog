package org.deslrey.aop;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.deslrey.entity.po.ArticleVisitLog;
import org.deslrey.mapper.ArticleVisitLogMapper;
import org.deslrey.util.IPUtils;
import org.deslrey.util.RedisUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.Parameter;
import java.util.HashMap;
import java.util.Map;

/**
 * <br>
 * 访问量记录
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/24 17:13
 */
@Aspect
@Component
public class VisitLogAspect {

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private ArticleVisitLogMapper logMapper;

    @Autowired
    private RedisUtils redisUtils;

    @After("@annotation(org.deslrey.annotation.VisitLog)")
    public void recordVisitLog(JoinPoint joinPoint) {

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Map<String, Object> paramMap = getMethodParams(joinPoint.getArgs(), signature.getMethod().getParameters());
        Integer articleId = (Integer) paramMap.get("id");

        String ip = IPUtils.getClientIP(request);

        // 1. Redis 去重：30 秒内同 IP 同文章不记录日志
        String visitKey = "article:visit:" + articleId + ":" + ip;
        if (redisUtils.hasKey(visitKey)) {
            return;
        }
        redisUtils.set(visitKey, "1", 30);

        // 2. Redis 统计访问量（PV）
        String pvKey = "article:pv";
        redisUtils.hincrBy(pvKey, articleId.toString(), 1);


        // 3. 记录访问日志
        String location = IPUtils.isLocalAccess(ip) ? "本机访问" : IPUtils.queryIPLocation(ip);
        String ua = request.getHeader("User-Agent");
        String device = IPUtils.getDeviceType(ua);
        String referer = request.getHeader("Referer");

        ArticleVisitLog log = new ArticleVisitLog();
        log.setArticleId(articleId);
        log.setIp(ip);
        log.setLocation(location);
        log.setUserAgent(ua);
        log.setReferer(referer);
        log.setDevice(device);

        logMapper.insertVisitLog(log);
    }

    /**
     * 将方法参数名与值映射
     */
    private Map<String, Object> getMethodParams(Object[] args, Parameter[] parameters) {
        Map<String, Object> map = new HashMap<>();
        for (int i = 0; i < parameters.length; i++) {
            map.put(parameters[i].getName(), args[i]);
        }
        return map;
    }
}