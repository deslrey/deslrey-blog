package org.deslrey.service;


import jakarta.servlet.http.HttpServletRequest;

/**
 * <p>
 * 文章访问日志表 服务类
 * </p>
 *
 * @author deslrey
 * @since 2025-11-24
 */
public interface ArticleVisitLogService {


    void recordAsync(Integer articleId, String ip, String ua, String referer);
}
