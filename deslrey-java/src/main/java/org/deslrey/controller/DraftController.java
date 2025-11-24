package org.deslrey.controller;

import com.github.pagehelper.PageInfo;
import org.deslrey.annotation.RequireLogin;
import org.deslrey.entity.po.Draft;
import org.deslrey.result.Results;
import org.deslrey.service.DraftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @RequireLogin
    @GetMapping("draftList")
    public Results<PageInfo<Draft>> draftList(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int pageSize) {
        return draftService.draftList(page, pageSize);
    }

    @RequireLogin
    @GetMapping("detail/{id}")
    public Results<Draft> DraftDetail(@PathVariable Integer id) {
        return draftService.DraftDetail(id);
    }

    @RequireLogin
    @PostMapping("addDraft")
    public Results<Void> addDraft(@RequestBody Draft draft) {
        return draftService.addDraft(draft);
    }

    @RequireLogin
    @PostMapping("updateDraft")
    public Results<Void> updateDraft(@RequestBody Draft draft) {
        return draftService.updateDraft(draft);
    }

    @RequireLogin
    @DeleteMapping("deleteDraft/{id}")
    public Results<Void> deleteDraft(@PathVariable Integer id){
        return draftService.deleteDraft(id);
    }
}
