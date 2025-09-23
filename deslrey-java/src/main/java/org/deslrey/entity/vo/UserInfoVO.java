package org.deslrey.entity.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * <br>
 * 用户实体类vo
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/23 9:07
 */
@Data
public class UserInfoVO {

    /**
     * 主键
     */
    private Integer id;

    /**
     * 用户名
     */
    private String userName;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 创建日期
     */
    private LocalDateTime createTime;

    /**
     * 更新日期
     */
    private LocalDateTime updateTime;


}
