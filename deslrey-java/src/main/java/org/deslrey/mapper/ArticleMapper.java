package org.deslrey.mapper;

import org.apache.ibatis.annotations.Param;
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

    List<Article> selectArticleList();

    Article selectArticleDetail(Integer id);

    List<Article> selectArticleByCategory(String title);

    List<Article> selectViewHot();

    List<Article> selectAdminArticleList();

    Article selectEditArticleById(@Param("articleId") Integer articleId);

    int insertArticle(Article article);

    int updateArticle(Article article);

    void updateViewCount(@Param("articleId") Integer articleId, @Param("pv") Integer pv);

    int updateExist(Integer id, Boolean exist);
}
