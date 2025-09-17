package org.deslrey.service;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Folder;
import org.deslrey.result.Results;

/**
 * <br>
 * 文件夹接口
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/16 16:47
 */
public interface FolderService {
    Results<PageInfo<Folder>> folderList(String type, int page, int pageSize);

    Results<Void> addFolder(Folder folder);
}
