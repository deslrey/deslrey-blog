package org.deslrey.controller;


import com.github.pagehelper.PageInfo;
import org.deslrey.annotation.RequireLogin;
import org.deslrey.entity.po.Article;
import org.deslrey.entity.po.Category;
import org.deslrey.entity.vo.ArticleListVO;
import org.deslrey.entity.vo.CountVO;
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
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("categoryList")
    public Results<PageInfo<Category>> categoryList(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int pageSize) {
        return categoryService.categoryList(page, pageSize);
    }

    @GetMapping("categoryCount")
    public Results<List<CountVO>> categoryCount() {
        return categoryService.categoryCount();
    }

    @GetMapping("{title}")
    public Results<PageInfo<ArticleListVO>> categoryArticle(@PathVariable String title, @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int pageSize) {
        return categoryService.categoryArticle(title,page,pageSize);
    }

    @RequireLogin
    @PostMapping("addCategory")
    public Results<Void> addCategory(@RequestBody Category category) {
        return categoryService.addCategory(category);
    }

    @RequireLogin
    @PostMapping("updateCategoryTitle")
    public Results<Void> updateCategoryTitle(@RequestBody Category category) {
        return categoryService.updateCategoryTitle(category);
    }

    @RequireLogin
    @GetMapping("categoryArticleList")
    public Results<List<Category>> categoryArticleList() {
        return categoryService.categoryArticleList();
    }
}
