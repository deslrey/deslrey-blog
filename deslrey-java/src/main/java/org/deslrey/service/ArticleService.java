package org.deslrey.service;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Article;
import org.deslrey.result.Results;

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
public interface ArticleService {
    Results<List<Article>> LatestReleases();

    Results<PageInfo<Article>> articleList(int page, int pageSize);

    Results<Article> articleDetail(Integer id);

    Results<List<Article>> viewHot();

    Results<PageInfo<Article>> adminArticleList(int page, int pageSize);
}
