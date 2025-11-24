package org.deslrey.aop;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.deslrey.entity.po.ArticleVisitLog;
import org.deslrey.mapper.ArticleVisitLogMapper;
import org.deslrey.util.IPUtils;
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

    @After("@annotation(org.deslrey.annotation.VisitLog)")
    public void recordVisitLog(JoinPoint joinPoint) {

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();

        Map<String, Object> paramMap = getMethodParams(joinPoint.getArgs(), signature.getMethod().getParameters());
        Integer articleId = (Integer) paramMap.get("id");

        String ip = IPUtils.getClientIP(request);

        // 如果是本机访问，直接 location 写 “本机访问”
        String location;
        if (IPUtils.isLocalAccess(ip)) {
            location = "本机访问";
        } else {
            location = IPUtils.queryIPLocation(ip);
        }
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