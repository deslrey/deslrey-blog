package org.deslrey.controller.admin;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Folder;
import org.deslrey.result.Results;
import org.deslrey.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * <br>
 * 文件夹控制层
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/16 16:46
 */
@RestController
@RequestMapping("folder")
public class FolderController {

    @Autowired
    private FolderService folderService;

    @GetMapping("list")
    public Results<PageInfo<Folder>> folderList(@RequestParam(defaultValue = "all") String type, @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int pageSize) {
        return folderService.folderList(type, page, pageSize);
    }

    @PostMapping("addFolder")
    public Results<Void> addFolder(@RequestBody Folder folder) {
        return folderService.addFolder(folder);
    }
}
