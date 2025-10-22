package org.deslrey.service;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.vo.ImageVO;
import org.deslrey.result.Results;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * <br>
 * 图片接口
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/16 16:05
 */
public interface ImageService {
    Results<Void> uploadImage(MultipartFile file, Integer folderId);

    Results<PageInfo<ImageVO>> imageList(int page, int pageSize);

    Results<PageInfo<ImageVO>> selectImagesByFolderId(Integer folderId, int page, int pageSize);

    Results<List<ImageVO>> obscureFolderName(String folderName);
}
