package org.deslrey.entity.po;

import lombok.Data;

import java.util.List;

/**
 * <br>
 * 文章草稿
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/18 16:18
 */
@Data
public class ArticleDraft {

    private Integer id;

    /**
     * 标题
     */
    private String title;

    /**
     * 正文
     */
    private String content;

    /**
     * 分类
     */
    private Integer categoryId;

    /**
     * 标签id集合
     */
    private List<Integer> tagIdList;

    /**
     * 描述
     */
    private String des;


}
