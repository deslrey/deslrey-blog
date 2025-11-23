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
 * @since 2025/11/23 10:33
 */
public interface FolderMapper {
    List<Folder> selectFolderNameList();

    List<Folder> selectFolderList();

}
