package org.deslrey.mapper;

import org.deslrey.entity.po.Draft;

import java.util.List;

/**
 * <br>
 * 草稿mapper
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/22 10:52
 */
public interface DraftMapper {
    List<Draft> selectDraftList();

    Draft selectDraftById(Integer id);

    int insertDraft(Draft draft);

}
