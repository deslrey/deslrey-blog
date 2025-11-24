package org.deslrey.controller;

import com.github.pagehelper.PageInfo;
import org.deslrey.annotation.RequireLogin;
import org.deslrey.annotation.VisitLog;
import org.deslrey.entity.po.Article;
import org.deslrey.entity.po.ArticleDraft;
import org.deslrey.entity.vo.ArticleDraftVO;
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

    @VisitLog
    @GetMapping("articleDetail/{id}")
    public Results<Article> articleDetail(@PathVariable Integer id) {
        return articleService.articleDetail(id);
    }

    @RequireLogin
    @GetMapping("admin-list")
    public Results<PageInfo<Article>> adminArticleList(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int pageSize) {
        return articleService.adminArticleList(page, pageSize);
    }

    @RequireLogin
    @GetMapping("viewHot")
    public Results<List<Article>> viewHot() {
        return articleService.viewHot();
    }

    @RequireLogin
    @GetMapping("editArticle/{articleId}")
    public Results<ArticleDraftVO> editArticle(@PathVariable Integer articleId) {
        return articleService.editArticle(articleId);
    }

    @RequireLogin
    @PostMapping("addArticle")
    public Results<Void> addArticle(@RequestBody ArticleDraft articleDraft) {
        return articleService.addArticle(articleDraft);
    }

}
