package org.deslrey.mapper;

import org.apache.ibatis.annotations.Param;
import org.deslrey.entity.po.Draft;

import java.util.List;

/**
 * <br>
 * 草稿mapper
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/23 11:42
 */
public interface DraftMapper {
    List<Draft> selectDraftList();

    Draft selectDraftById(@Param("id") Integer id);

    int insertDraft(Draft draft);

    int updateDraftById(Draft draft);

    int deleteDraftById(@Param("id") Integer id);

}
