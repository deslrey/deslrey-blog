package org.deslrey.service.impl;

import org.deslrey.convert.ArticleConvert;
import org.deslrey.entity.po.Article;
import org.deslrey.entity.vo.ArticleVO;
import org.deslrey.entity.vo.LatestReleasesVO;
import org.deslrey.mapper.ArticleMapper;
import org.deslrey.result.ResultCodeEnum;
import org.deslrey.result.Results;
import org.deslrey.service.ArticleService;
import org.deslrey.util.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <br>
 * 文章接口实现类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 15:37
 */
@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleMapper articleMapper;

    @Autowired
    private ArticleConvert articleConvert;

    /**
     * 查询最新发布的五篇文章
     */
    @Override
    public Results<List<LatestReleasesVO>> latestReleases() {
        List<LatestReleasesVO> latestReleasesVOS = articleMapper.latestReleases();
        if (latestReleasesVOS == null || latestReleasesVOS.isEmpty()) {
            return Results.ok();
        }
        return Results.ok(latestReleasesVOS);
    }

    public Results<List<ArticleVO>> getArticlesByPage(int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        List<Article> articleList = articleMapper.getArticlesByPage(offset, pageSize);
        if (articleList == null || articleList.isEmpty()) {
            return Results.ok();
        }
        return Results.ok(articleConvert.articleVOList(articleList));

    }

    @Override
    public Results<Article> detail(Integer id) {
        if (NumberUtils.isLessZero(id)) {
            return Results.fail(ResultCodeEnum.CODE_501);
        }

        Article article = articleMapper.detail(id);
        if (article == null) {
            return Results.fail("查找文章失败");
        }
        return Results.ok(article);

    }
}
