package org.deslrey.controller.web;

import org.deslrey.entity.po.Article;
import org.deslrey.entity.vo.ArchiveVO;
import org.deslrey.entity.vo.ArticleVO;
import org.deslrey.entity.vo.LatestReleasesVO;
import org.deslrey.result.Results;
import org.deslrey.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <br>
 * 文章控制层
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

    @GetMapping("detail/{id}")
    public Results<Article> detail(@PathVariable Integer id) {
        return articleService.detail(id);
    }

    @GetMapping("list")
    public Results<List<ArticleVO>> articleList(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int pageSize) {
        return articleService.getArticlesByPage(page, pageSize);
    }

    @GetMapping("LatestReleases")
    public Results<List<LatestReleasesVO>> latestReleases() {
        return articleService.latestReleases();
    }

    @GetMapping("archiveList")
    public Results<List<ArchiveVO>> archiveList() {
        return articleService.archiveList();
    }
}
