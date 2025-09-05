package org.deslrey.service.impl;

import org.deslrey.entity.vo.LatestReleasesVO;
import org.deslrey.mapper.ArticleMapper;
import org.deslrey.result.Results;
import org.deslrey.service.ArticleService;
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

    /**
     * 查询最新发布的五篇文章
     */
    @Override
    public Results<List<LatestReleasesVO>> latestReleases() {
        List<LatestReleasesVO> latestReleasesVOS = articleMapper.latestReleases();
        if (latestReleasesVOS == null || latestReleasesVOS.isEmpty()) {
            return new Results<>();
        }
        return Results.ok(latestReleasesVOS);
    }
}
