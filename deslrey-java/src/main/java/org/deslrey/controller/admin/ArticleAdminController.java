package org.deslrey.controller.admin;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.admin.po.ArticleDraft;
import org.deslrey.entity.admin.vo.ArticleAdminVO;
import org.deslrey.entity.admin.vo.ArticleDraftVO;
import org.deslrey.result.Results;
import org.deslrey.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * <br>
 * 文章控制器   --  管理端
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/16 8:59
 */
@RestController
@RequestMapping("admin/article")
public class ArticleAdminController {

    @Autowired
    private ArticleService articleService;

    @GetMapping("list")
    public Results<PageInfo<ArticleAdminVO>> articleList(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int pageSize) {
        return articleService.articleListAdmin(page, pageSize);
    }

    @PostMapping("addArticle")
    public Results<Void> addArticle(@RequestBody ArticleDraft articleDraft) {
        return articleService.addArticle(articleDraft);
    }

    @GetMapping("editArticle/{articleId}")
    public Results<ArticleDraftVO> editArticle(@PathVariable Integer articleId) {
        return articleService.editArticle(articleId);
    }

}
