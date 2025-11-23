package org.deslrey.mapper;

import org.apache.ibatis.annotations.Param;
import org.deslrey.entity.po.Category;
import org.deslrey.entity.vo.CountVO;

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
    List<CountVO> selectCategoryCount();

    List<Category> selectCategoryList();

    int insertCategory(@Param("categoryTitle") String categoryTitle);

    int updateCategoryTitle(Category category);
}
