package org.deslrey.service;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Category;
import org.deslrey.entity.vo.CategoryCountVO;
import org.deslrey.entity.vo.CategoryVO;
import org.deslrey.result.Results;

import java.util.List;

/**
 * <br>
 * 分类接口
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/15 11:43
 */
public interface CategoryService {
    Results<List<CategoryCountVO>> categoryCountList();

    Results<List<CategoryVO>> categoryArticleList();

    Results<PageInfo<Category>> categoryList(int page, int pageSize);

    Results<Void> updateCategoryTitle(Category category);

    Results<Void> addCategory(Category category);
}
