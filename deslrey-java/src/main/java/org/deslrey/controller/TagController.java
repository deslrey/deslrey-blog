package org.deslrey.controller;

import org.deslrey.entity.vo.TagCountVO;
import org.deslrey.result.Results;
import org.deslrey.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
@RequestMapping("tag")
public class TagController {

    @Autowired
    private TagService tagService;

    @GetMapping("list")
    public Results<List<TagCountVO>> tagList() {
        return tagService.tagList();
    }

}
