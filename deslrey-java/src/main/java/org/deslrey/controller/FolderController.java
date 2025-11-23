package org.deslrey.controller;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Folder;
import org.deslrey.result.Results;
import org.deslrey.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

}
