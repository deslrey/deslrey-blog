package org.deslrey.controller;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Article;
import org.deslrey.result.Results;
import org.deslrey.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <br>
 * 文章控制层
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/7 20:38
 */
@RestController
@RequestMapping("/article")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping("LatestReleases")
    public Results<List<Article>> LatestReleases() {
        return articleService.LatestReleases();
    }

    @GetMapping("list")
    public Results<PageInfo<Article>> articleList(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int pageSize) {
        return articleService.articleList(page, pageSize);
    }

}
