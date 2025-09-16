package org.deslrey.controller.web;

import org.deslrey.entity.vo.CategoryCountVO;
import org.deslrey.result.Results;
import org.deslrey.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <br>
 * 分类控制层
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/15 11:41
 */
@RestController
@RequestMapping("category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("list")
    public Results<List<CategoryCountVO>> categoryList() {
        return categoryService.categoryList();
    }
}
