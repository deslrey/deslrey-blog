package org.deslrey.mapper;

import org.deslrey.entity.vo.CategoryCountVO;

import java.util.List;

/**
 * <br>
 * 分类mapper
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/8 14:30
 */
public interface CategoryMapper {
    List<CategoryCountVO> selectCategoryCount();
}
