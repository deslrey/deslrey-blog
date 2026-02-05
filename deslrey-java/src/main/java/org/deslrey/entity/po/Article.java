package org.deslrey.entity.po;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <br>
 * 文章实体类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 15:43
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class Article implements Serializable {

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
     * 字数
     */
    private Integer wordCount;

    /**
     * 浏览量
     */
    private Integer views;

    /**
     * 阅读时间
     */
    private Integer readTime;

    /**
     * 创建日期
     */
    private LocalDateTime createTime;

    /**
     * 更新日期
     */
    private LocalDateTime updateTime;

    /**
     * 分类Id
     */
    private Integer categoryId;

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
