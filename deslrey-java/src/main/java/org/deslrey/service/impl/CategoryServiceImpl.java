package org.deslrey.service.impl;

import org.deslrey.mapper.CategoryMapper;
import org.deslrey.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

}
