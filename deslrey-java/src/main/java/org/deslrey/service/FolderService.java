package org.deslrey.service;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Folder;
import org.deslrey.result.Results;

import java.util.List;

/**
 * <br>
 * 文件夹接口
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/23 10:32
 */
public interface FolderService {
    Results<List<Folder>> folderNameList();

    Results<PageInfo<Folder>> folderList( int page, int pageSize);
}
