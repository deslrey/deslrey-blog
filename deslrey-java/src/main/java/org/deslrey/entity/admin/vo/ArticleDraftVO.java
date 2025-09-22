package org.deslrey.entity.admin.vo;

import lombok.Data;
import org.deslrey.entity.po.Category;
import org.deslrey.entity.vo.CategoryVO;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <br>
 * 文章草稿vo
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/18 16:18
 */
@Data
public class ArticleDraftVO {

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
    private CategoryVO categoryPO;

    /**
     * 标签id集合
     */
    private List<Integer> tagIdList;


    /**
     * 描述
     */
    private String des;


}
