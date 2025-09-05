package org.deslrey.controller;

import org.deslrey.entity.vo.ArticleVO;
import org.deslrey.entity.vo.LatestReleasesVO;
import org.deslrey.result.Results;
import org.deslrey.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <br>
 *
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 16:48
 */
@RestController
@RequestMapping("article")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping("list")
    public Results<List<ArticleVO>> articleList(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int pageSize) {
        List<ArticleVO> articleVOList = articleService.getArticlesByPage(page, pageSize);
        return Results.ok(articleVOList);
    }

    @PostMapping("LatestReleases")
    public Results<List<LatestReleasesVO>> latestReleases() {
        List<LatestReleasesVO> latestReleasesVOS = articleService.latestReleases();
        return Results.ok(latestReleasesVOS);
    }

}
