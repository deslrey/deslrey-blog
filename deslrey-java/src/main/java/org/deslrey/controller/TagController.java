package org.deslrey.controller;


import com.github.pagehelper.PageInfo;
import org.deslrey.annotation.RequireLogin;
import org.deslrey.entity.po.Article;
import org.deslrey.entity.po.Tag;
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

    @GetMapping("tagList")
    public Results<PageInfo<Tag>> tagList(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int pageSize) {
        return tagService.tagList(page, pageSize);
    }

    @GetMapping("tagCount")
    public Results<List<CountVO>> tagCount() {
        return tagService.tagCount();
    }

    @GetMapping("{title}")
    public Results<List<Article>> tagArticle(@PathVariable String title) {
        return tagService.tagArticle(title);
    }

    @RequireLogin
    @PostMapping("addTag")
    public Results<Void> addTag(@RequestBody Tag tag) {
        return tagService.addTag(tag);
    }

    @RequireLogin
    @PostMapping("updateTagTitle")
    public Results<Void> updateTagTitle(@RequestBody Tag tag) {
        return tagService.updateTagTitle(tag);
    }

}
