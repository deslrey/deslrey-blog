package org.deslrey.mapper;

import org.deslrey.entity.po.Folder;

import java.util.List;

/**
 * <br>
 * 文件夹mapper
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/16 16:46
 */
public interface FolderMapper {
    List<Folder> folderAll();

    List<Folder> folderList();
}
