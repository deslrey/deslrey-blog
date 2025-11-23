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
 * @since 2025/11/23 11:42
 */
public interface DraftMapper {
    List<Draft> selectDraftList();

}
