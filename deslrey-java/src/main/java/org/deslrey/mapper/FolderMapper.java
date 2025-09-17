package org.deslrey.mapper;

import org.apache.ibatis.annotations.Param;
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

    boolean existsFolderByName(String folderName);

    int save(@Param("folderName") String folderName, @Param("path") String path);

    boolean selectById(@Param("id") Integer id);

    int updateFolderById(Folder folder);
}
