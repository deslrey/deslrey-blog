package org.deslrey.entity.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * <br>
 * 归档VO
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/15 8:42
 */
@Data
public class ArchiveVO {

    /**
     * id
     */
    private Integer id;

    /**
     * 标题
     */
    private String title;

    /**
     * 创建日期
     */
    private LocalDateTime createTime;

    /**
     * 已编辑
     */
    private Boolean edit;


}
