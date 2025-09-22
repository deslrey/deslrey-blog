package org.deslrey.convert;

import org.deslrey.entity.admin.po.ArticleDraft;
import org.deslrey.entity.admin.vo.ArticleDraftVO;
import org.deslrey.entity.po.Article;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

/**
 * <br>
 *
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/22 9:35
 */
@Mapper(componentModel = "spring")
public interface ArticleDraftConvert {

    ArticleDraftConvert INSTANCE = Mappers.getMapper(ArticleDraftConvert.class);

    ArticleDraft convert(ArticleDraftVO articleDraftVO);

    ArticleDraftVO convert(ArticleDraft articleDraft);

    ArticleDraft convert(Article article);

    ArticleDraftVO convertVO(Article article);

}

