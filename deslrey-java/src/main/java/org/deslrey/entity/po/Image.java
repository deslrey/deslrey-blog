package org.deslrey.entity.po;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <br>
 * 图片存储
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/16 15:55
 */

@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class Image implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    private Integer id;
    /**
     * 文章主键
     */
    private Integer articleId;

    /**
     * 图片名称
     */
    private String imageName;

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
    private Integer size;

    /**
     * 创建日期
     */
    private LocalDateTime createTime;


}