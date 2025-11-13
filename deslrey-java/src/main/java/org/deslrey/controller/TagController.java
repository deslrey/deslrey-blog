package org.deslrey.controller;


import org.deslrey.entity.po.Article;
import org.deslrey.entity.vo.CountVO;
import org.deslrey.result.Results;
import org.deslrey.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <br>
 * 标签控制层
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/15 11:40
 */
@RestController
@RequestMapping("/tag")
public class TagController {

    @Autowired
    private TagService tagService;

    @GetMapping("tagCount")
    public Results<List<CountVO>> tagCount() {
        return tagService.tagCount();
    }

    @GetMapping("{title}")
    public Results<List<Article>> tagArticle(@PathVariable String title) {
        return tagService.tagArticle(title);
    }

}
