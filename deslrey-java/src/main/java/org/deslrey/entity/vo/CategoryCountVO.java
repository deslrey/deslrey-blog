package org.deslrey.entity.vo;

import lombok.Data;

/**
 * <br>
 * 分类统计
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/15 14:57
 */
@Data
public class CategoryCountVO {

    /**
     * 主键
     */
    private Integer id;

    /**
     * 分类标题
     */
    private String title;

    /**
     * 分类统计
     */
    private Integer total;

}
