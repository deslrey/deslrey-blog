package org.deslrey.controller;

import com.github.pagehelper.PageInfo;
import org.deslrey.annotation.RequireLogin;
import org.deslrey.entity.po.Folder;
import org.deslrey.result.Results;
import org.deslrey.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <br>
 * 文件夹控制层
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/23 10:32
 */
@RestController
@RequestMapping("/folder")
public class FolderController {

    @Autowired
    private FolderService folderService;

    @GetMapping("list")
    public Results<PageInfo<Folder>> folderList(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int pageSize) {
        return folderService.folderList(page, pageSize);
    }

    @GetMapping("folderNameList")
    public Results<List<Folder>> folderNameList() {
        return folderService.folderNameList();
    }

    @RequireLogin
    @PostMapping("addFolder")
    public Results<Void> addFolder(@RequestBody Folder folder) {
        return folderService.addFolder(folder);
    }

    @RequireLogin
    @PostMapping("updateFolder")
    public Results<Void> updateFolder(@RequestBody Folder folder) {
        return folderService.updateFolder(folder);
    }

}
