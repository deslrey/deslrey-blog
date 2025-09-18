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
 * @since 2025/9/16 16:05
 */
public interface ImageMapper {
    int insertImage(Image image);

    List<ImageVO> allList();

    List<ImageVO> modicumList();

}
