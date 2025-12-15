package org.deslrey.service.impl;

import com.alibaba.fastjson2.JSON;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.deslrey.entity.po.Article;
import org.deslrey.entity.po.Category;
import org.deslrey.entity.vo.ArticleListVO;
import org.deslrey.entity.vo.ArticleTagVO;
import org.deslrey.entity.vo.CountVO;
import org.deslrey.mapper.ArticleMapper;
import org.deslrey.mapper.ArticleTagMapper;
import org.deslrey.mapper.CategoryMapper;
import org.deslrey.result.ResultCodeEnum;
import org.deslrey.result.Results;
import org.deslrey.service.CategoryService;
import org.deslrey.util.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @Autowired
    private ArticleMapper articleMapper;

    @Autowired
    private ArticleTagMapper articleTagMapper;

    @Autowired
    private RedisUtils redisUtils;

    @Autowired
    private DataInitUtils dataInitUtils;

    @Override
    public Results<PageInfo<Category>> categoryList(int page, int pageSize) {
        PageHelper.startPage(page, pageSize);
        List<Category> categoryList = categoryMapper.selectCategoryList();
        if (categoryList == null || categoryList.isEmpty()) {
            return Results.ok(new PageInfo<>(new ArrayList<>()));
        }
        PageInfo<Category> categoryPageInfo = new PageInfo<>(categoryList);
        return Results.ok(categoryPageInfo);
    }

    @Override
    public Results<List<CountVO>> categoryCount() {
        String categoryJson = redisUtils.get(StaticUtils.CATEGORY_COUNT);
        if (StringUtils.isEmpty(categoryJson)) {
            List<CountVO> categoryCountVOList = categoryMapper.selectCategoryCount();
            if (categoryCountVOList == null || categoryCountVOList.isEmpty()) {
                return Results.ok(new ArrayList<>(0));
            }
            redisUtils.set(StaticUtils.CATEGORY_COUNT, JSON.toJSONString(categoryCountVOList));
            return Results.ok(categoryCountVOList);
        } else {
            List<CountVO> list = JSON.parseArray(categoryJson, CountVO.class);
            if (list == null || list.isEmpty()) {
                return Results.ok(new ArrayList<>(0));
            }
            return Results.ok(list);
        }
    }

    @Override
    public Results<PageInfo<ArticleListVO>> categoryArticle(String title, int page, int pageSize) {
        if (StringUtils.isEmpty(title)) {
            return Results.ok(new PageInfo<>(new ArrayList<>(0)));
        }
        PageHelper.startPage(page, pageSize);
        List<ArticleListVO> articleList = articleMapper.selectArticleByCategory(title);

        if (ArticleServiceImpl.ArticleTags(articleList, articleTagMapper))
            return Results.ok(new PageInfo<>(new ArrayList<>(0)));

        return Results.ok(new PageInfo<>(articleList));
    }

    @Override
    public Results<Void> addCategory(Category category) {
        if (category == null || StringUtils.isBlank(category.getCategoryTitle())) {
            return Results.fail(ResultCodeEnum.EMPTY_VALUE);
        }

        int result = categoryMapper.insertCategory(category.getCategoryTitle());
        if (result > 0) {
            dataInitUtils.CategoryInit();
            return Results.ok("添加成功");
        }
        return Results.fail("添加失败");
    }

    @Override
    public Results<Void> updateCategoryTitle(Category category) {
        if (category == null || NumberUtils.isLessZero(category.getId()) || StringUtils.isBlank(category.getCategoryTitle())) {
            return Results.fail(ResultCodeEnum.EMPTY_VALUE);
        }

        int result = categoryMapper.updateCategoryTitle(category);
        if (result > 0) {
            dataInitUtils.CategoryInit();
            return Results.ok("更新成功");
        }
        return Results.fail("更新失败");
    }

    @Override
    public Results<List<Category>> categoryArticleList() {
        List<Category> categoryList = categoryMapper.selectCategoryArticleList();
        if (categoryList == null || categoryList.isEmpty()) {
            return Results.ok(new ArrayList<>(0));
        }

        return Results.ok(categoryList);
    }
}
