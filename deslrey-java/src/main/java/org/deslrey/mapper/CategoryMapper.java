package org.deslrey.mapper;

import org.deslrey.entity.po.Category;
import org.deslrey.entity.vo.CategoryCountVO;

import java.util.List;

/**
 * <br>
 * 分类mapper
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/15 11:42
 */
public interface CategoryMapper {
    List<CategoryCountVO> categoryList();

    List<Category> categoryListAdmin();
}
