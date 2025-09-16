package org.deslrey.entity.admin.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * <br>
 * 文章vo实体类 --  管理端
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/16 9:24
 */
@Data
public class ArticleAdminVO {

    /**
     * 主键
     */
    private Integer id;

    /**
     * 标题
     */
    private String title;

    /**
     * 字数
     */
    private Integer wordCount;

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
     * 描述
     */
    private String des;

    /**
     * 置顶
     */
    private Boolean sticky;

    /**
     * 已编辑
     */
    private Boolean edit;

    /**
     * 启用
     */
    private Boolean exist;
}
