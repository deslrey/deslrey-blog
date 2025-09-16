package org.deslrey.convert;

import org.deslrey.entity.po.Category;
import org.deslrey.entity.vo.CategoryVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * <br>
 * 分类实体类相互转换
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/16 14:56
 */
@Mapper(componentModel = "spring")
public interface CategoryConvert {

    CategoryConvert INSTANCE = Mappers.getMapper(CategoryConvert.class);

    Category convert(CategoryVO vo);

    CategoryVO convert(Category category);

    List<Category> categoryList(List<CategoryVO> categoryVOList);

    List<CategoryVO> categoryVOList(List<Category> categoryList);

}
