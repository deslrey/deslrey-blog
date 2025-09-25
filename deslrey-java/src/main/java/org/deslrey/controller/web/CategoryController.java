package org.deslrey.controller.web;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Category;
import org.deslrey.entity.vo.CategoryCountVO;
import org.deslrey.entity.vo.CategoryVO;
import org.deslrey.result.Results;
import org.deslrey.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
@RequestMapping("/public/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;


    @GetMapping("categoryList")
    public Results<PageInfo<Category>> categoryList(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int pageSize) {
        return categoryService.categoryList(page, pageSize);
    }

    @GetMapping("categoryCountList")

    public Results<List<CategoryCountVO>> categoryCountList() {
        return categoryService.categoryCountList();
    }

    @GetMapping("categoryArticleList")
    public Results<List<CategoryVO>> categoryArticleList() {
        return categoryService.categoryArticleList();
    }

    @PostMapping("updateCategoryTitle")
    public Results<Void> updateCategoryTitle(@RequestBody Category category) {
        return categoryService.updateCategoryTitle(category);
    }

    @PostMapping("addCategory")
    public Results<Void> addCategory(@RequestBody Category category) {
        return categoryService.addCategory(category);
    }


}
