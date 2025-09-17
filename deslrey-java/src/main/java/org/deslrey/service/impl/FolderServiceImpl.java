package org.deslrey.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Folder;
import org.deslrey.mapper.FolderMapper;
import org.deslrey.result.Results;
import org.deslrey.service.FolderService;
import org.deslrey.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <br>
 * 文件夹接口实现类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/16 16:47
 */
@Service
public class FolderServiceImpl implements FolderService {

    @Autowired
    private FolderMapper folderMapper;

    @Override
    public Results<PageInfo<Folder>> folderList(String type, int page, int pageSize) {
        PageHelper.startPage(page, pageSize);
        List<Folder> folderList;
        if (StringUtils.isEmpty(type) || "all".equals(type)) {
            folderList = folderMapper.folderAll();
        } else {
            folderList = folderMapper.folderList();
        }
        PageInfo<Folder> pageInfo = new PageInfo<>(folderList);
        return Results.ok(pageInfo);
    }
}
