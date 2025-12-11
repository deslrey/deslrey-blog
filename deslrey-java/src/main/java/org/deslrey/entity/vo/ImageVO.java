package org.deslrey.entity.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * <br>
 * 图片vo
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/18 10:41
 */
@Data
public class ImageVO {

    /**
     * 主键
     */
    private Integer id;
    /**
     * 所属文件夹名称
     */
    private String folderName;

    /**
     * 图片名称
     */
    private String originalName;

    /**
     * 存储路径
     */
    private String path;

    /**
     * 图片链接
     */
    private String url;

    /**
     * 文件大小
     */
    private Long size;

    /**
     * 创建日期
     */
    private LocalDateTime createTime;

}
