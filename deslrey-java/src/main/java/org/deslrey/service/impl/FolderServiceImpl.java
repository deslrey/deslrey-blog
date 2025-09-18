package org.deslrey.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Folder;
import org.deslrey.mapper.FolderMapper;
import org.deslrey.result.ResultCodeEnum;
import org.deslrey.result.Results;
import org.deslrey.service.FolderService;
import org.deslrey.util.NumberUtils;
import org.deslrey.util.StaticUtils;
import org.deslrey.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
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

    @Value("${custom.static-source-path}")
    private String staticSourcePath;

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

    @Override
    public Results<Void> addFolder(Folder folder) {
        if (folder == null) {
            return Results.fail(ResultCodeEnum.CODE_501);
        }
        if (StringUtils.isBlank(folder.getFolderName()) || StringUtils.isBlank(folder.getPath())) {
            return Results.fail(ResultCodeEnum.EMPTY_VALUE);
        }

        boolean folderExist = folderMapper.existsFolderByName(folder.getFolderName());
        if (folderExist) {
            return Results.fail(ResultCodeEnum.CODE_601);
        }

        int result = folderMapper.save(folder.getFolderName(), staticSourcePath + File.separator + folder.getPath());
        if (result == 0) {
            return Results.fail("添加失败");
        }
        return Results.ok("添加成功");
    }

    @Override
    public Results<Void> updateFolder(Folder folder) {
        if (folder == null) {
            return Results.fail(ResultCodeEnum.CODE_501);
        }

        if (NumberUtils.isLessZero(folder.getId()) || StringUtils.isBlank(folder.getFolderName()) || StringUtils.isBlank(folder.getPath())) {
            return Results.fail(ResultCodeEnum.EMPTY_VALUE);
        }

        boolean folderExist = folderMapper.selectExistById(folder.getId());
        if (!folderExist) {
            return Results.fail("修改的数据不存在");
        }

        int result = folderMapper.updateFolderById(folder);

        if (result > 0) {
            return Results.ok("修改成功");
        }
        return Results.fail("修改失败");
    }

    @Override
    public Results<List<Folder>> folderNameList() {
        List<Folder> folderList = folderMapper.folderNameList();
        if (folderList == null || folderList.isEmpty()) {
            return Results.ok(new ArrayList<>());
        }
        return Results.ok(folderList);
    }
}
