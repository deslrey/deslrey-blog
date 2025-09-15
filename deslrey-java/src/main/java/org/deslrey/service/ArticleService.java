package org.deslrey.service;

import org.deslrey.entity.po.Article;
import org.deslrey.entity.vo.ArchiveVO;
import org.deslrey.entity.vo.ArticleVO;
import org.deslrey.entity.vo.LatestReleasesVO;
import org.deslrey.result.Results;

import java.util.List;

/**
 * <br>
 * 文章接口
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 15:37
 */
public interface ArticleService {
    Results<List<LatestReleasesVO>> latestReleases();

    Results<List<ArticleVO>> getArticlesByPage(int page, int pageSize);

    Results<Article> detail(Integer id);

    Results<List<ArchiveVO>> archiveList();
}
