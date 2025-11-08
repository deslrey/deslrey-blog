package org.deslrey.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.deslrey.entity.vo.CountVO;
import org.deslrey.mapper.CategoryMapper;
import org.deslrey.result.Results;
import org.deslrey.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * <br>
 * 分类控制层
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/8 14:29
 */
@Slf4j
@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public Results<List<CategoryCountVO>> categoryCount() {
        List<CountVO> categoryCountVOList = categoryMapper.selectCategoryCount();
        if (categoryCountVOList == null || categoryCountVOList.isEmpty()) {
            return Results.ok(new ArrayList<>());
        }
        return Results.ok(categoryCountVOList);
    }
}
