package org.deslrey.service.impl;

import org.deslrey.entity.vo.CategoryCountVO;
import org.deslrey.mapper.ArticleMapper;
import org.deslrey.mapper.CategoryMapper;
import org.deslrey.result.Results;
import org.deslrey.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * <br>
 * 分类接口实现类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/15 11:43
 */
@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private ArticleMapper articleMapper;

    @Override
    public Results<List<CategoryCountVO>> categoryList() {
        List<CategoryCountVO> categoryCountVOList = categoryMapper.categoryList();
        if (categoryCountVOList == null || categoryCountVOList.isEmpty()) {
            return Results.ok(new ArrayList<>());
        }
        return Results.ok(categoryCountVOList);
    }
}
