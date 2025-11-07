package org.deslrey.entity.po;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <br>
 * 草稿
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/22 10:48
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class Draft implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    private Integer id;

    /**
     * 标题
     */
    private String title;

    /**
     * 内容
     */
    private String content;

    /**
     * 描述
     */
    private String des;

    /**
     * 创建日期
     */
    private LocalDateTime createTime;

    /**
     * 更新日期
     */
    private LocalDateTime updateTime;


}

