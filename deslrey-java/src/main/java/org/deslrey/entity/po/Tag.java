package org.deslrey.entity.po;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <br>
 * 标签
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/15 11:36
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class Tag implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    private Integer id;

    /**
     * 标签标题
     */
    private String tagTitle;

    /**
     * 创建日期
     */
    private LocalDateTime createTime;

}