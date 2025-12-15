package org.deslrey.aop;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.deslrey.entity.po.ArticleVisitLog;
import org.deslrey.mapper.ArticleVisitLogMapper;
import org.deslrey.service.ArticleVisitLogService;
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
    private ArticleVisitLogService articleVisitLogService;

    @After("@annotation(org.deslrey.annotation.VisitLog)")
    public void recordVisitLog(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Map<String, Object> paramMap = getMethodParams(joinPoint.getArgs(), signature.getMethod().getParameters());
        Integer articleId = (Integer) paramMap.get("id");

        // 这里直接取请求相关信息
        String ip = IPUtils.getClientIP(request);
        String ua = request.getHeader("User-Agent");
        String referer = request.getHeader("Referer");

        articleVisitLogService.recordAsync(articleId, ip, ua, referer);
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