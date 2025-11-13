package org.deslrey.mapper;

import org.deslrey.entity.po.Article;

import java.util.List;

/**
 * <br>
 * 文章 - 标签 mapper
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/15 15:54
 */
public interface ArticleTagMapper {

    List<Article> selectArticleTag(Integer tagId);
}
