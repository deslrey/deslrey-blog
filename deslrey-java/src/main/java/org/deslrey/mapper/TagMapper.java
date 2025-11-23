package org.deslrey.mapper;

import org.apache.ibatis.annotations.Param;
import org.deslrey.entity.po.Tag;
import org.deslrey.entity.vo.CountVO;

import java.util.List;

/**
 * <br>
 * 标签mapper
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/8 14:53
 */
public interface TagMapper {
    List<CountVO> selectTagCount();

    Integer selectIdByTitle(String title);

    List<Tag> selectTagList();

    int insertTag(@Param("tagTitle") String tagTitle);

    int updateTagTitle(Tag tag);
}
