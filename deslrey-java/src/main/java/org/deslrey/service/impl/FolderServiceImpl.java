package org.deslrey.service.impl;

import org.deslrey.mapper.FolderMapper;
import org.deslrey.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

}
