package org.deslrey.convert;

import org.deslrey.entity.po.Article;
import org.deslrey.entity.vo.ArticleVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * <br>
 * 文章实体类相互转换
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 19:03
 */

@Mapper(componentModel = "spring")
public interface ArticleConvert {

    ArticleConvert INSTANCE = Mappers.getMapper(ArticleConvert.class);

    Article convert(ArticleVO articleVO);

    ArticleVO convert(Article article);

    List<Article> articleList(List<ArticleVO> articleVOList);

    List<ArticleVO> articleVOList(List<Article> articleList);

}
