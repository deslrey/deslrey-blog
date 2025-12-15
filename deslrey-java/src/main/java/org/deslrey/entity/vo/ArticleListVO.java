package org.deslrey.entity.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <br>
 *
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/12/15 22:32
 */
@Data
public class ArticleListVO {
    /**
     * 主键
     */
    private Integer id;

    /**
     * 标题
     */
    private String title;


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
     * 标签
     */
    private List<String> tags;
}
