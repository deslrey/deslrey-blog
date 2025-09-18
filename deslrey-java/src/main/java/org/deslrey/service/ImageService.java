package org.deslrey.service;

import org.deslrey.result.Results;
import org.springframework.web.multipart.MultipartFile;

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
}
