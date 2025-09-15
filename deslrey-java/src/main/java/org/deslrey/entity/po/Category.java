package org.deslrey.entity.po;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <br>
 * 分类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/15 11:33
 */

@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class Category implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    private Integer id;

    /**
     * 分类标题
     */
    private String categoryTitle;

    /**
     * 创建日期
     */
    private LocalDateTime createTime;

}