package org.deslrey.controller.admin;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.admin.vo.ArticleAdminVO;
import org.deslrey.result.Results;
import org.deslrey.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

}
