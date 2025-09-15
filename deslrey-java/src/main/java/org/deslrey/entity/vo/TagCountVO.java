package org.deslrey.entity.vo;

import lombok.Data;

/**
 * <br>
 * 标签统计
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/15 16:02
 */
@Data
public class TagCountVO {

    /**
     * 主键
     */
    private Integer id;

    /**
     * 标签标题
     */
    private String title;

    /**
     * 数量
     */
    private Integer total;

}
