package org.deslrey.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Article;
import org.deslrey.mapper.ArticleMapper;
import org.deslrey.result.ResultCodeEnum;
import org.deslrey.result.Results;
import org.deslrey.service.ArticleService;
import org.deslrey.util.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * <br>
 *
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/7 20:34
 */
@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleMapper articleMapper;

    @Override
    public Results<List<Article>> LatestReleases() {
        List<Article> articleList = articleMapper.selectLatestReleases();
        if (articleList == null || articleList.isEmpty()) {
            return Results.ok(new ArrayList<>());
        }
        return Results.ok(articleList);
    }

    @Override
    public Results<PageInfo<Article>> articleList(int page, int pageSize) {
        if (page < 1)
            page = 1;
        if (pageSize < 1)
            pageSize = 1;
        PageHelper.startPage(page, pageSize);
        List<Article> articleList = articleMapper.selectArticleList();
        PageInfo<Article> articlePageInfo = new PageInfo<>(articleList);
        return Results.ok(articlePageInfo);
    }

    @Override
    public Results<PageInfo<Article>> adminArticleList(int page, int pageSize) {
        if (page < 1)
            page = 1;
        if (pageSize < 1)
            pageSize = 1;
        PageHelper.startPage(page, pageSize);
        List<Article> articleList = articleMapper.selectAdminArticleList();
        PageInfo<Article> articlePageInfo = new PageInfo<>(articleList);
        return Results.ok(articlePageInfo);
    }

    @Override
    public Results<Article> articleDetail(Integer id) {
        if (NumberUtils.isLessZero(id)) {
            return Results.fail(ResultCodeEnum.CODE_501);
        }

        Article article = articleMapper.selectArticleDetail(id);
        if (article == null) {
            return Results.fail("查找文章失败");
        }
        return Results.ok(article);
    }

    @Override
    public Results<List<Article>> viewHot() {
        List<Article> articleList = articleMapper.selectViewHot();
        return Results.ok(articleList);
    }
}
