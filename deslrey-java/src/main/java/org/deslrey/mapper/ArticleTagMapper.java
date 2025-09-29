package org.deslrey.mapper;

import org.apache.ibatis.annotations.Param;
import org.deslrey.entity.po.ArticleTag;
import org.deslrey.entity.vo.ArticleVO;

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
    void insertArticleTag(Integer articleId, Integer tagId);

    List<Integer> selectArticleTagListById(@Param("articleId") Integer articleId);


    List<ArticleVO> selectArticleByTagId(Integer tagId);
}
