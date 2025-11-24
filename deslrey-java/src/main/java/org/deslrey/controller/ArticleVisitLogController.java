package org.deslrey.controller;


import org.deslrey.service.ArticleVisitLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 文章访问日志表 前端控制器
 * </p>
 *
 * @author deslrey
 * @since 2025-11-24
 */
@RestController
@RequestMapping("/article-visit-log")
public class ArticleVisitLogController {

    @Autowired
    private ArticleVisitLogService articleVisitLogService;


}
