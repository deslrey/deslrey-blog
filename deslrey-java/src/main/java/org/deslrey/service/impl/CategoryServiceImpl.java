package org.deslrey.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.deslrey.entity.po.Article;
import org.deslrey.entity.vo.CountVO;
import org.deslrey.mapper.ArticleMapper;
import org.deslrey.mapper.CategoryMapper;
import org.deslrey.result.Results;
import org.deslrey.service.CategoryService;
import org.deslrey.util.StringUtils;
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

    @Autowired
    private ArticleMapper articleMapper;

    @Override
    public Results<List<CountVO>> categoryCount() {
        List<CountVO> categoryCountVOList = categoryMapper.selectCategoryCount();
        if (categoryCountVOList == null || categoryCountVOList.isEmpty()) {
            return Results.ok(new ArrayList<>());
        }
        return Results.ok(categoryCountVOList);
    }

    @Override
    public Results<List<Article>> categoryArticle(String title) {
        if (StringUtils.isEmpty(title)) {
            return Results.ok(new ArrayList<>(0));
        }
        List<Article> articleList = articleMapper.selectArticleByCategory(title);
        if (articleList == null || articleList.isEmpty()) {
            return Results.ok(new ArrayList<>(0));
        }
        return Results.ok(articleList);
    }
}
