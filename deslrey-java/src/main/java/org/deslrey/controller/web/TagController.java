package org.deslrey.controller.web;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Tag;
import org.deslrey.entity.vo.TagCountVO;
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
@RequestMapping("/public/tag")
public class TagController {

    @Autowired
    private TagService tagService;


    @GetMapping("tagList")
    public Results<PageInfo<Tag>> tagList(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int pageSize) {
        return tagService.tagList(page, pageSize);
    }

    @GetMapping("tagCountList")
    public Results<List<TagCountVO>> tagCountList() {
        return tagService.tagCountList();
    }

    @GetMapping("tagNameList")
    public Results<List<Tag>> tagNameList() {
        return tagService.tagNameList();
    }

    @PostMapping("addTag")
    public Results<Void> addTag(@RequestBody Tag tag) {
        return tagService.addTag(tag);
    }

    @PostMapping("updateTagTitle")
    public Results<Void> updateTagTitle(@RequestBody Tag tag) {
        return tagService.updateTagTitle(tag);
    }

}
