package org.deslrey.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.deslrey.convert.CategoryConvert;
import org.deslrey.entity.po.Article;
import org.deslrey.entity.po.Category;
import org.deslrey.entity.vo.ArticleVO;
import org.deslrey.entity.vo.CategoryCountVO;
import org.deslrey.entity.vo.CategoryVO;
import org.deslrey.mapper.ArticleMapper;
import org.deslrey.mapper.CategoryMapper;
import org.deslrey.result.ResultCodeEnum;
import org.deslrey.result.Results;
import org.deslrey.service.CategoryService;
import org.deslrey.util.NumberUtils;
import org.deslrey.util.StringUtils;
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
    public Results<PageInfo<Category>> categoryList(int page, int pageSize) {
        PageHelper.startPage(page, pageSize);
        List<Category> categoryList = categoryMapper.categoryList();
        if (categoryList == null || categoryList.isEmpty()) {
            return Results.ok(new PageInfo<>(new ArrayList<>()));
        }
        PageInfo<Category> categoryPageInfo = new PageInfo<>(categoryList);
        return Results.ok(categoryPageInfo);
    }

    @Override
    public Results<List<CategoryCountVO>> categoryCountList() {
        List<CategoryCountVO> categoryCountVOList = categoryMapper.categoryCountList();
        if (categoryCountVOList == null || categoryCountVOList.isEmpty()) {
            return Results.ok(new ArrayList<>());
        }
        return Results.ok(categoryCountVOList);
    }

    @Override
    public Results<List<CategoryVO>> categoryArticleList() {
        List<Category> categoryList = categoryMapper.categoryArticleList();
        if (categoryList == null || categoryList.isEmpty()) {
            return Results.ok(new ArrayList<>());
        }

        List<CategoryVO> categoriedVOList = CategoryConvert.INSTANCE.categoryVOList(categoryList);
        return Results.ok(categoriedVOList);
    }

    @Override
    public Results<Void> updateCategoryTitle(Category category) {
        if (category == null || NumberUtils.isLessZero(category.getId()) || StringUtils.isBlank(category.getCategoryTitle())) {
            return Results.fail(ResultCodeEnum.EMPTY_VALUE);
        }

        int result = categoryMapper.updateCategoryTitle(category);
        if (result > 0) {
            return Results.ok("更新成功");
        }
        return Results.fail("更新失败");
    }

    @Override
    public Results<Void> addCategory(Category category) {
        if (category == null || StringUtils.isBlank(category.getCategoryTitle())) {
            return Results.fail(ResultCodeEnum.EMPTY_VALUE);
        }

        int result = categoryMapper.insertCategory(category.getCategoryTitle());
        if (result > 0) {
            return Results.ok("添加成功");
        }
        return Results.fail("添加失败");
    }

    @Override
    public Results<List<Article>> articleByCategory(String category) {
        if (StringUtils.isEmpty(category)) {
            return Results.ok(new ArrayList<>());
        }
        List<Article> articleVOList = articleMapper.selectArticleByCategory(category);
        if (articleVOList == null || articleVOList.isEmpty()) {
            return Results.ok(new ArrayList<>());
        }
        return Results.ok(articleVOList);
    }
}
