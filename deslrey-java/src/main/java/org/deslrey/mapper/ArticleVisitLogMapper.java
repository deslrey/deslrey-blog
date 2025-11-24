package org.deslrey.mapper;


import org.deslrey.entity.po.ArticleVisitLog;

/**
 * <p>
 * 文章访问日志表 Mapper 接口
 * </p>
 *
 * @author author
 * @since 2025-11-24
 */
public interface ArticleVisitLogMapper {

    void insertVisitLog(ArticleVisitLog log);
}
