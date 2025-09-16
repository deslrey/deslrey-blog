package org.deslrey.entity.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * <br>
 * 文章VO类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 18:20
 */
@Data
public class ArticleVO {
    /**
     * 主键
     */
    private Integer id;

    /**
     * 标题
     */
    private String title;

    /**
     * 浏览量
     */
    private Integer views;

    /**
     * 创建日期
     */
    private LocalDateTime createTime;

    /**
     * 更新日期
     */
    private LocalDateTime updateTime;

    /**
     * 分类
     */
    private String category;

    /**
     * 置顶
     */
    private Boolean sticky;

    /**
     * 已编辑
     */
    private Boolean edit;
}
