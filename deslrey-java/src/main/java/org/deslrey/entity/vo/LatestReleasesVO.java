package org.deslrey.entity.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * <br>
 * 最近更新
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 16:53
 */
@Data
public class LatestReleasesVO {

    /**
     * 主键
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

}
