package org.deslrey.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.deslrey.entity.po.Folder;
import org.deslrey.mapper.FolderMapper;
import org.deslrey.result.Results;
import org.deslrey.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * <br>
 * 文件夹接口实现类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/23 10:32
 */
@Slf4j
@Service
public class FolderServiceImpl implements FolderService {

    @Autowired
    private FolderMapper folderMapper;

    @Override
    public Results<PageInfo<Folder>> folderList(int page, int pageSize) {
        PageHelper.startPage(page, pageSize);
        List<Folder> folderList = folderMapper.selectFolderList();
        PageInfo<Folder> pageInfo = new PageInfo<>(folderList);
        return Results.ok(pageInfo);
    }

    @Override
    public Results<List<Folder>> folderNameList() {
        List<Folder> folderList = folderMapper.selectFolderNameList();
        if (folderList == null || folderList.isEmpty()) {
            return Results.ok(new ArrayList<>(0));
        }
        return Results.ok(folderList);
    }
}
