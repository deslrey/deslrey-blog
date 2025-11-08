package org.deslrey.mapper;

import org.deslrey.entity.po.Article;

import java.util.List;

/**
 * <br>
 * 文章mapper
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/7 20:25
 */
public interface ArticleMapper {
    List<Article> selectLatestReleases();
}
