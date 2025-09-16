package org.deslrey.service;

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
    Results<List<CategoryCountVO>> categoryList();

    Results<List<CategoryVO>> categoryListAdmin();

}
