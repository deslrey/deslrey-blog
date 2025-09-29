package org.deslrey.mapper;

import org.apache.ibatis.annotations.Param;
import org.deslrey.entity.po.Tag;
import org.deslrey.entity.vo.ArticleVO;
import org.deslrey.entity.vo.TagCountVO;

import java.util.List;

/**
 * <br>
 * 标签mapper
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/15 11:42
 */
public interface TagMapper {

    List<TagCountVO> tagCountList();

    List<Tag> tagNameList();

    List<Tag> tagList();

    int insertTag(@Param("tagTitle") String tagTitle);

    int updateTagTitle(Tag tag);

    Integer selectIdByTitle(String title);

}
