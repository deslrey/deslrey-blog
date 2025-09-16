package org.deslrey.entity.vo;

import lombok.Data;

/**
 * <br>
 * 分类vo
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/16 14:53
 */
@Data
public class CategoryVO {

    /**
     * 主键
     */
    private Integer id;

    /**
     * 分类标题
     */
    private String categoryTitle;

}
