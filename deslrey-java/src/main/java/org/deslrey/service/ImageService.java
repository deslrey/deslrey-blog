package org.deslrey.service;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.vo.ImageVO;
import org.deslrey.result.Results;
import org.springframework.web.multipart.MultipartFile;

/**
 * <br>
 * 图片接口
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/23 9:45
 */
public interface ImageService {
    Results<PageInfo<ImageVO>> imageList(int page, int pageSize);

    Results<Void> uploadImage(MultipartFile file, Integer folderId);
}
