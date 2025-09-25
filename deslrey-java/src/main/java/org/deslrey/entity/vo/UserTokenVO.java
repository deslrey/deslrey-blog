package org.deslrey.entity.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * <br>
 * 用户登陆基本返回信息
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/24 11:22
 */
@Data
public class UserTokenVO {

    /**
     * 用户名
     */
    private String userName;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 头像
     */
    private String avatar;

    /**
     * token
     */
    private String token;

}
