package org.deslrey.service;

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

}
