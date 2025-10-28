package org.deslrey.mapper;

import org.apache.ibatis.annotations.Param;
import org.deslrey.entity.admin.po.ArticleDraft;
import org.deslrey.entity.admin.vo.ArticleAdminVO;
import org.deslrey.entity.admin.vo.ArticleDraftVO;
import org.deslrey.entity.po.Article;
import org.deslrey.entity.vo.ArchiveVO;
import org.deslrey.entity.vo.ArticleVO;
import org.deslrey.entity.vo.LatestReleasesVO;

import java.util.List;

/**
 * <br>
 * 文章mapper
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 15:38
 */
public interface ArticleMapper {

    List<LatestReleasesVO> latestReleases();

    List<Article> getArticlesByPage(@Param("offset") int offset, @Param("pageSize") int pageSize);

    Article detail(Integer id);

    List<ArchiveVO> archiveList();

    List<ArticleAdminVO> getArticlesAdmin();

    int insertArticle(Article article);

    Article editArticle(@Param("articleId") Integer articleId);

    List<Article> selectArticles();

    List<Article> selectArticleByCategory(String category);

    List<ArticleAdminVO> selectViewHot();

}
