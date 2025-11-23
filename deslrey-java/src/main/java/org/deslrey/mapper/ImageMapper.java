package org.deslrey.mapper;

import org.deslrey.entity.po.Image;
import org.deslrey.entity.vo.ImageVO;

import java.util.List;

/**
 * <br>
 * 图片mapper
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/23 9:46
 */
public interface ImageMapper {
    List<ImageVO> selectList();

    int insertImage(Image image);

    List<ImageVO> selectObscureFolderName(String folderName);
}
