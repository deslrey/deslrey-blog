package org.deslrey.controller;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Draft;
import org.deslrey.result.Results;
import org.deslrey.service.DraftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <br>
 * 草稿控制器
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/23 11:40
 */
@RestController
@RequestMapping("/draft")
public class DraftController {

    @Autowired
    private DraftService draftService;

    @GetMapping("draftList")
    public Results<PageInfo<Draft>> draftList(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int pageSize) {
        return draftService.draftList(page, pageSize);
    }

}
