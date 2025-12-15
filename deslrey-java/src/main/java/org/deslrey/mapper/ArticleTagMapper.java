package org.deslrey.mapper;

import org.apache.ibatis.annotations.Param;
import org.deslrey.entity.po.Article;
import org.deslrey.entity.vo.ArticleListVO;
import org.deslrey.entity.vo.ArticleTagVO;

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

    List<ArticleListVO> selectArticleTag(Integer tagId);

    List<Integer> selectArticleTagListById(@Param("articleId") Integer articleId);

    void deleteTagByArticleId(@Param("articleId") Integer id);

    void insertArticleTag(@Param("articleId") Integer id, @Param("tagId") Integer tagId);

    List<ArticleTagVO> selectTagsByArticleIds(@Param("ids") List<Integer> ids);

}
