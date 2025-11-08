package org.deslrey.service.impl;

import org.deslrey.entity.po.Article;
import org.deslrey.mapper.ArticleMapper;
import org.deslrey.result.Results;
import org.deslrey.service.ArticleService;
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
}
