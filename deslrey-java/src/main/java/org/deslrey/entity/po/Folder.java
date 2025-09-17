package org.deslrey.entity.po;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <br>
 * 文件夹实体
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/16 16:44
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class Folder implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    private Integer id;

    /**
     * 文件夹名称
     */
    private String folderName;

    /**
     * 存储路径
     */
    private String path;

    /**
     * 创建日期
     */
    private LocalDateTime createTime;


}
