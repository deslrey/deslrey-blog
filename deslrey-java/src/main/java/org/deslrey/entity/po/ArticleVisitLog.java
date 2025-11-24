package org.deslrey.entity.po;


import java.io.Serial;
import java.time.LocalDateTime;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 文章访问日志表
 * </p>
 *
 * @author author
 * @since 2025-11-24
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class ArticleVisitLog implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    private Long id;

    /**
     * 访问的文章ID
     */
    private Integer articleId;

    /**
     * 访问IP
     */
    private String ip;

    /**
     * IP地址
     */
    private String location;

    /**
     * 浏览器 User-Agent
     */
    private String userAgent;

    /**
     * 来源页面（可能为空）
     */
    private String referer;

    /**
     * 访问时间
     */
    private LocalDateTime visitTime;

    /**
     * 访问设备类型（PC/Mobile/Tablet）
     */
    private String device;


}
