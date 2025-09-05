package org.deslrey.service.impl;

import org.deslrey.convert.ArticleConvert;
import org.deslrey.entity.po.Article;
import org.deslrey.entity.vo.ArticleVO;
import org.deslrey.entity.vo.LatestReleasesVO;
import org.deslrey.mapper.ArticleMapper;
import org.deslrey.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    public List<LatestReleasesVO> latestReleases() {
        List<LatestReleasesVO> latestReleasesVOS = articleMapper.latestReleases();
        if (latestReleasesVOS == null || latestReleasesVOS.isEmpty()) {
            return new ArrayList<>();
        }
        return latestReleasesVOS;
    }

    public List<ArticleVO> getArticlesByPage(int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        List<Article> articleList = articleMapper.getArticlesByPage(offset, pageSize);
        if (articleList == null || articleList.isEmpty()) {
            return new ArrayList<>();
        }
        return articleConvert.articleVOList(articleList);

    }

}
